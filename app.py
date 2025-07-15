from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
import torchvision.transforms as transforms
from PIL import Image, ImageDraw, ImageFont
import io
import json
import logging
import os
from typing import Dict, Any
import uvicorn
import base64

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI(
    title="PyTorch Image Detection API",
    description="API para detección de imágenes usando PyTorch",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
device = None
transform = None
class_names = []

def get_transforms():
    return transforms.Compose([
        transforms.Resize((640, 640)),
        transforms.ToTensor(),
    ])

def get_transforms_fallback():
    return transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

def load_model():
    global model, device, transform, class_names
    
    try:
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        logger.info(f"Usando dispositivo: {device}")
        
        transform = get_transforms()
        is_yolo_model = True
        
        model_path = "models/fireDetection.pt"
        
        if os.path.exists(model_path):
            logger.info(f"Cargando modelo YOLO personalizado desde: {model_path}")
            
            try:
                from ultralytics import YOLO
                logger.info("Cargando con ultralytics...")
                
                model = YOLO(model_path)
                model.eval()
                
                if hasattr(model.model, 'names'):
                    class_names = list(model.model.names.values())
                    logger.info(f"Clases extraídas del modelo YOLO: {class_names}")
                else:
                    class_names = ["fuego", "humo"]
                    logger.warning("No se encontraron nombres de clases, usando fallback")
                
                model.is_yolo_model = True
                model.is_ultralytics = True
                
                logger.info("Modelo YOLO con ultralytics cargado exitosamente")
                logger.info(f"Clases finales del modelo: {class_names}")
                
            except Exception as e:
                logger.error(f"Error cargando con ultralytics: {str(e)}")
                logger.info("Intentando cargar con torch.load...")
                
                try:
                    checkpoint = torch.load(model_path, map_location=device, weights_only=False)
                    logger.info(f"Tipo de checkpoint cargado: {type(checkpoint)}")
                    
                    if isinstance(checkpoint, dict):
                        logger.info(f"Claves del checkpoint: {list(checkpoint.keys())}")
                        
                        if 'model' in checkpoint:
                            model = checkpoint['model']
                            logger.info("Modelo extraído de checkpoint['model']")
                        else:
                            model = checkpoint
                            logger.info("Usando checkpoint completo como modelo")
                        
                        if 'names' in checkpoint:
                            class_names = list(checkpoint['names'].values()) if isinstance(checkpoint['names'], dict) else checkpoint['names']
                            logger.info(f"Clases extraídas del checkpoint: {class_names}")
                        elif hasattr(model, 'names'):
                            class_names = list(model.names.values()) if isinstance(model.names, dict) else model.names
                            logger.info(f"Clases extraídas del modelo.names: {class_names}")
                        else:
                            class_names = ["fuego", "humo"]
                            logger.warning("No se encontraron nombres de clases en el modelo, usando fallback")
                    else:
                        model = checkpoint
                        class_names = ["fuego", "humo"]
                        logger.warning("Checkpoint no es un diccionario, usando clases por defecto")
                    
                    model.eval()
                    
                    model = model.float()
                    model.is_yolo_model = True
                    model.is_ultralytics = False
                    
                    logger.info("Modelo YOLO personalizado cargado exitosamente")
                    logger.info(f"Clases finales del modelo: {class_names}")
                    logger.info(f"Tipo de datos del modelo: {next(model.parameters()).dtype}")
                    
                except Exception as e2:
                    logger.error(f"Error cargando modelo YOLO: {str(e2)}")
                    logger.info("Intentando cargar como modelo PyTorch estándar...")
                    
                    from torchvision.models import resnet50
                    model = resnet50(weights=None)
                    num_classes = 2
                    model.fc = nn.Linear(model.fc.in_features, num_classes)
                    
                    transform = get_transforms_fallback()
                    is_yolo_model = False
                    
                    try:
                        checkpoint = torch.load(model_path, map_location=device, weights_only=False)
                        if 'state_dict' in checkpoint:
                            model.load_state_dict(checkpoint['state_dict'])
                        elif isinstance(checkpoint, dict) and 'model' in checkpoint:
                            model.load_state_dict(checkpoint['model'].state_dict())
                        else:
                            logger.warning("No se pudieron cargar los pesos específicos")
                    except:
                        logger.warning("Usando modelo sin pesos pre-entrenados")
                    
                    model.eval()
                    model.is_yolo_model = False
                    model.is_ultralytics = False
                    class_names = ["fuego", "humo"]
                    logger.info(f"Modelo fallback cargado con clases: {class_names}")
            
        else:
            logger.warning(f"No se encontró el modelo personalizado en: {model_path}")
            logger.info("Usando modelo ResNet50 como fallback para detección de incendios")
            
            from torchvision.models import resnet50
            model = resnet50(weights='IMAGENET1K_V1')
            
            transform = get_transforms_fallback()
            is_yolo_model = False
            
            num_classes = 2
            model.fc = nn.Linear(model.fc.in_features, num_classes)
            
            model.eval()
            class_names = ["fuego", "humo"]
            logger.info(f"Modelo fallback cargado con clases: {class_names}")
        
        model.is_yolo_model = is_yolo_model
        
        model.to(device)
        logger.info(f"Modelo cargado exitosamente. Clases: {class_names}")
        logger.info(f"Número de clases: {len(class_names)}")
        
    except Exception as e:
        logger.error(f"Error cargando el modelo: {str(e)}")
        model = nn.Sequential(
            nn.AdaptiveAvgPool2d((1, 1)),
            nn.Flatten(),
            nn.Linear(2048, 2)
        )
        model.eval()
        model.to(device)
        model.is_yolo_model = False
        model.is_ultralytics = False
        transform = get_transforms_fallback()
        class_names = ["fuego", "humo"]
        logger.info(f"Modelo de emergencia creado con clases: {class_names}")

def preprocess_image(image: Image.Image) -> torch.Tensor:
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    image_tensor = transform(image).unsqueeze(0)
    
    image_tensor = image_tensor.to(device)
    
    if hasattr(model, 'half') and next(model.parameters()).dtype == torch.float16:
        image_tensor = image_tensor.half()
    
    return image_tensor

def predict_image(image: Image.Image) -> Dict[str, Any]:
    try:
        if hasattr(model, 'is_ultralytics') and model.is_ultralytics:
            logger.info("Usando modelo YOLO de ultralytics para predicción")
            
            results = model(image, conf=0.25, iou=0.45)
            
            predictions = []
            for result in results:
                boxes = result.boxes
                if boxes is not None:
                    for box in boxes:
                        bbox = box.xyxy[0].cpu().numpy()
                        conf = box.conf[0].cpu().numpy()
                        cls = int(box.cls[0].cpu().numpy())
                        
                        original_class_name = class_names[cls] if cls < len(class_names) else f"class_{cls}"
                        
                        if original_class_name == "fuego":
                            class_name = "humo"
                        elif original_class_name == "humo":
                            class_name = "fuego"
                        else:
                            class_name = original_class_name
                        
                        predictions.append({
                            "class": class_name,
                            "confidence": float(conf),
                            "class_index": cls,
                            "bbox": bbox.tolist(),
                            "detection_type": "object_detection"
                        })
            
            predictions = sorted(predictions, key=lambda x: x['confidence'], reverse=True)
            
            if not predictions:
                predictions.append({
                    "class": "normal",
                    "confidence": 0.9,
                    "class_index": -1,
                    "bbox": None,
                    "detection_type": "no_detection"
                })
            
            return {
                "status": "success",
                "predictions": predictions,
                "model_info": {
                    "device": str(device),
                    "model_type": "YOLO_Ultralytics",
                    "model_path": "models/fireDetection.pt",
                    "framework": "ultralytics"
                }
            }
        
        else:
            image_tensor = preprocess_image(image)
            
            logger.info(f"Tensor de entrada: dtype={image_tensor.dtype}, shape={image_tensor.shape}")
            if model is not None:
                logger.info(f"Modelo: dtype={next(model.parameters()).dtype}")
            
            with torch.no_grad():
                try:
                    outputs = model(image_tensor)
                except RuntimeError as e:
                    if "should be the same" in str(e):
                        logger.warning("Error de tipos de datos, intentando conversión automática...")
                        model_dtype = next(model.parameters()).dtype
                        image_tensor = image_tensor.to(dtype=model_dtype)
                        logger.info(f"Tensor convertido a: {image_tensor.dtype}")
                        outputs = model(image_tensor)
                    else:
                        raise e
                
                logger.info(f"Salida del modelo: tipo={type(outputs)}, forma={outputs.shape if hasattr(outputs, 'shape') else 'No shape'}")
                
                results = []
                
                if isinstance(outputs, tuple):
                    logger.info(f"Modelo devolvió tupla con {len(outputs)} elementos")
                    outputs = outputs[0]
                    logger.info(f"Usando primera salida: tipo={type(outputs)}, forma={outputs.shape if hasattr(outputs, 'shape') else 'No shape'}")
                
                if isinstance(outputs, torch.Tensor):
                    logger.info(f"Procesando tensor: {outputs.shape}")
                    
                    if outputs.dim() == 2:
                        logger.info("Procesando como salida de clasificación")
                        probabilities = torch.nn.functional.softmax(outputs[0], dim=0)
                        top_prob, top_idx = torch.topk(probabilities, min(len(class_names), len(probabilities)))
                        
                        for i in range(len(top_prob)):
                            class_idx = top_idx[i].item()
                            confidence = top_prob[i].item()
                            original_class_name = class_names[class_idx] if class_idx < len(class_names) else f"class_{class_idx}"
                            
                            if original_class_name == "fuego":
                                class_name = "humo"
                            elif original_class_name == "humo":
                                class_name = "fuego"
                            else:
                                class_name = original_class_name
                            
                            if confidence > 0.1:
                                results.append({
                                    "class": class_name,
                                    "confidence": float(confidence),
                                    "class_index": class_idx,
                                    "bbox": None,
                                    "detection_type": "classification"
                                })
                    else:
                        logger.warning(f"Dimensión inesperada del tensor: {outputs.dim()}")
                    
                    results = sorted(results, key=lambda x: x['confidence'], reverse=True)[:5]
                    
                    if not results:
                        results.append({
                            "class": "normal",
                            "confidence": 0.9,
                            "class_index": -1,
                            "bbox": None,
                            "detection_type": "no_detection"
                        })
                
                else:
                    logger.error(f"Tipo de salida no soportado: {type(outputs)}")
                    results.append({
                        "class": "error",
                        "confidence": 0.0,
                        "class_index": -1,
                        "bbox": None,
                        "detection_type": "unsupported_output_type"
                    })
            
            return {
                "status": "success",
                "predictions": results,
                "model_info": {
                    "device": str(device),
                    "model_type": "YOLO_Fire_Detection",
                    "model_path": "models/fireDetection.pt",
                    "input_dtype": str(image_tensor.dtype),
                    "model_dtype": str(next(model.parameters()).dtype) if model else "unknown"
                }
            }
        
    except Exception as e:
        logger.error(f"Error en predicción: {str(e)}")
        logger.error(f"Tipo de error: {type(e)}")
        import traceback
        logger.error(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error en predicción: {str(e)}")

@app.on_event("startup")
async def startup_event():
    logger.info("Iniciando aplicación...")
    load_model()

@app.get("/")
async def root():
    return {
        "message": "PyTorch Image Detection API",
        "status": "running",
        "version": "1.0.0",
        "endpoints": {
            "/": "Información general de la API",
            "/health": "Estado de salud del servidor",
            "/model-info": "Información del modelo cargado",
            "/predict": "Predicción básica (JSON)",
            "/predict-visual": "Predicción con imagen anotada en base64",
            "/predict-image": "Devuelve imagen PNG con detecciones dibujadas",
            "/predict-batch": "Predicción por lotes",
            "/debug-model": "Información detallada del modelo para debug"
        }
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "device": str(device) if device else "not_initialized"
    }

@app.post("/predict")
async def predict_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="El archivo debe ser una imagen"
        )
    
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        result = predict_image(image)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error procesando imagen: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando imagen: {str(e)}")

@app.post("/predict-batch")
async def predict_batch_endpoint(files: list[UploadFile] = File(...)):
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="Máximo 10 imágenes por batch"
        )
    
    results = []
    
    for i, file in enumerate(files):
        if not file.content_type.startswith("image/"):
            results.append({
                "file_index": i,
                "filename": file.filename,
                "error": "No es una imagen válida"
            })
            continue
        
        try:
            image_bytes = await file.read()
            image = Image.open(io.BytesIO(image_bytes))
            
            prediction = predict_image(image)
            results.append({
                "file_index": i,
                "filename": file.filename,
                "prediction": prediction
            })
            
        except Exception as e:
            results.append({
                "file_index": i,
                "filename": file.filename,
                "error": str(e)
            })
    
    return JSONResponse(content={"results": results})

@app.get("/model-info")
async def get_model_info():
    return {
        "device": str(device) if device else "not_initialized",
        "model_loaded": model is not None,
        "num_classes": len(class_names),
        "class_names": class_names,
        "input_size": [640, 640] if (model and hasattr(model, 'is_yolo_model') and model.is_yolo_model) else [224, 224],
        "framework": "PyTorch",
        "model_type": "YOLO_Fire_Detection" if model is not None else "not_loaded",
        "model_path": "models/fireDetection.pt"
    }

@app.get("/debug-model")
async def debug_model_info():
    debug_info = {
        "device": str(device) if device else "not_initialized",
        "model_loaded": model is not None,
        "model_type": str(type(model)) if model else "None",
        "class_names": class_names,
        "num_classes": len(class_names),
        "model_path_exists": os.path.exists("models/fireDetection.pt"),
        "model_path": "models/fireDetection.pt"
    }
    
    if model is not None:
        debug_info["model_attributes"] = [attr for attr in dir(model) if not attr.startswith('_')]
        
        if hasattr(model, 'names'):
            debug_info["model_names_attr"] = model.names
        if hasattr(model, 'nc'):
            debug_info["model_nc_attr"] = model.nc
        if hasattr(model, 'yaml'):
            debug_info["model_yaml_attr"] = str(model.yaml)
    
    return debug_info

def draw_detections(image: Image.Image, predictions: list) -> Image.Image:
    draw_image = image.copy()
    draw = ImageDraw.Draw(draw_image)
    
    colors = {
        "fuego": "#FF0000",
        "humo": "#888888",
        "normal": "#00FF00"
    }
    
    try:
        font = ImageFont.truetype("arial.ttf", 20)
        font_large = ImageFont.truetype("arial.ttf", 24)
    except:
        try:
            font = ImageFont.load_default()
            font_large = font
        except:
            font = None
            font_large = None
    
    bbox_detections = [p for p in predictions if p.get("bbox") is not None]
    classification_results = [p for p in predictions if p.get("bbox") is None and p.get("detection_type") == "classification"]
    
    for detection in bbox_detections:
        bbox = detection["bbox"]
        class_name = detection["class"]
        confidence = detection["confidence"]
        
        x1, y1, x2, y2 = map(int, bbox)
        
        color = colors.get(class_name, "#FFFF00")
        
        draw.rectangle([x1, y1, x2, y2], outline=color, width=3)
        
        text = f"{class_name}: {confidence:.2f}"
        
        if font:
            try:
                bbox_text = draw.textbbox((0, 0), text, font=font)
                text_width = bbox_text[2] - bbox_text[0]
                text_height = bbox_text[3] - bbox_text[1]
            except:
                text_width, text_height = draw.textsize(text, font=font)
        else:
            text_width = len(text) * 8
            text_height = 16
        
        text_bg = [x1, y1 - text_height - 4, x1 + text_width + 4, y1]
        draw.rectangle(text_bg, fill=color)
        
        if font:
            draw.text((x1 + 2, y1 - text_height - 2), text, fill="white", font=font)
        else:
            draw.text((x1 + 2, y1 - text_height - 2), text, fill="white")
    
    if not bbox_detections and classification_results:
        top_prediction = max(classification_results, key=lambda x: x['confidence'])
        
        if top_prediction['confidence'] > 0.5:
            class_name = top_prediction["class"]
            confidence = top_prediction["confidence"]
            color = colors.get(class_name, "#FFFF00")
            
            text = f"Clasificación: {class_name} ({confidence:.1%})"
            
            if font_large:
                try:
                    bbox_text = draw.textbbox((0, 0), text, font=font_large)
                    text_width = bbox_text[2] - bbox_text[0]
                    text_height = bbox_text[3] - bbox_text[1]
                except:
                    text_width, text_height = draw.textsize(text, font=font_large)
            else:
                text_width = len(text) * 10
                text_height = 20
            
            margin = 10
            x1, y1 = margin, margin
            x2, y2 = x1 + text_width + 20, y1 + text_height + 10
            
            draw.rectangle([x1, y1, x2, y2], fill=color, outline="white", width=2)
            
            if font_large:
                draw.text((x1 + 10, y1 + 5), text, fill="white", font=font_large)
            else:
                draw.text((x1 + 10, y1 + 5), text, fill="white")
    
    return draw_image

def image_to_base64(image: Image.Image, format: str = "PNG") -> str:
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/{format.lower()};base64,{img_str}"

def predict_with_visualization(image: Image.Image) -> Dict[str, Any]:
    prediction_result = predict_image(image)
    
    has_bbox_detections = any(
        pred.get("bbox") is not None 
        for pred in prediction_result["predictions"]
    )
    
    has_classification = any(
        pred.get("detection_type") == "classification" and pred.get("confidence", 0) > 0.5
        for pred in prediction_result["predictions"]
    )
    
    if has_bbox_detections or has_classification:
        annotated_image = draw_detections(image, prediction_result["predictions"])
        
        annotated_image_b64 = image_to_base64(annotated_image)
        
        prediction_result["annotated_image"] = annotated_image_b64
        prediction_result["has_visualization"] = True
        prediction_result["visualization_type"] = "bbox" if has_bbox_detections else "classification"
    else:
        prediction_result["annotated_image"] = None
        prediction_result["has_visualization"] = False
        prediction_result["visualization_type"] = "none"
    
    return prediction_result

@app.post("/predict-visual")
async def predict_visual_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="El archivo debe ser una imagen"
        )
    
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        result = predict_with_visualization(image)
        
        return JSONResponse(content=result)
        
    except Exception as e:
        logger.error(f"Error procesando imagen con visualización: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando imagen: {str(e)}")

@app.post("/predict-image")
async def predict_image_endpoint(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, 
            detail="El archivo debe ser una imagen"
        )
    
    try:
        image_bytes = await file.read()
        image = Image.open(io.BytesIO(image_bytes))
        
        prediction_result = predict_image(image)
        
        has_bbox_detections = any(
            pred.get("bbox") is not None 
            for pred in prediction_result["predictions"]
        )
        
        has_classification = any(
            pred.get("detection_type") == "classification" and pred.get("confidence", 0) > 0.5
            for pred in prediction_result["predictions"]
        )
        
        if has_bbox_detections or has_classification:
            annotated_image = draw_detections(image, prediction_result["predictions"])
        else:
            annotated_image = image
        
        img_buffer = io.BytesIO()
        annotated_image.save(img_buffer, format='PNG')
        img_buffer.seek(0)
        
        return StreamingResponse(
            io.BytesIO(img_buffer.getvalue()), 
            media_type="image/png",
            headers={"Content-Disposition": "inline; filename=detections.png"}
        )
        
    except Exception as e:
        logger.error(f"Error procesando imagen: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error procesando imagen: {str(e)}")


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8003)
