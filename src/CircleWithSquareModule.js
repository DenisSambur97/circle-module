import React, { useState, useRef, useEffect } from 'react';

const CircleWithSquare = () => {
    const [circleRadius, setCircleRadius] = useState(100);
    const [squareSize, setSquareSize] = useState(50);
    const [squareX, setSquareX] = useState(25);
    const [squareY, setSquareY] = useState(25);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [dragOffsetY, setDragOffsetY] = useState(0);

    const canvasRef = useRef();
    const animationFrameRef = useRef(null);

    useEffect(() => {
        // Отрисовываем начальное состояние холста и фигур
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Вычисляем координаты центра холста
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Рисуем окружность
        context.beginPath();
        context.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
        context.fillStyle = 'lightgray';
        context.fill();

        // Рисуем квадрат внутри окружности
        context.fillStyle = 'blue';
        context.fillRect(centerX + squareX - squareSize / 2, centerY + squareY - squareSize / 2, squareSize, squareSize);
    }, [circleRadius, squareSize, squareX, squareY]);

    // Обработчик изменения значений в инпутах
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case 'circleRadius':
                // Ограничиваем радиус окружности
                setCircleRadius(parseInt(value, 10));
                break;
            case 'squareSize':
                // Ограничиваем размер стороны квадрата
                setSquareSize(parseInt(value, 10));
                break;
            case 'squareX':
                // Ограничиваем координату X квадрата и обновляем состояние
                setSquareX(Math.min(circleRadius - squareSize / 2, Math.max(-circleRadius + squareSize / 2, parseInt(value, 10))));
                break;
            case 'squareY':
                // Ограничиваем координату Y квадрата и обновляем состояние
                setSquareY(Math.min(circleRadius - squareSize / 2, Math.max(-circleRadius + squareSize / 2, parseInt(value, 10))));
                break;
            default:
                break;
        }
    }

    // Обработчик нажатия кнопки мыши на холсте
    const handleCanvasMouseDown = (event) => {
        const { offsetX, offsetY } = event.nativeEvent;
        const centerX = canvasRef.current.width / 2;
        const centerY = canvasRef.current.height / 2;

        // Вычисляем расстояние от центра окружности до точки нажатия мыши
        const distance = Math.sqrt((offsetX - centerX) ** 2 + (offsetY - centerY) ** 2);
        // Вычисляем максимальное расстояние от центра, в пределах которого можно перемещать квадрат
        const maxDistance = circleRadius - squareSize / 2;

        if (distance <= maxDistance) {
            // Устанавливаем флаг перемещения и смещение относительно квадрата
            setIsDragging(true);
            setDragOffsetX(offsetX - (centerX + squareX));
            setDragOffsetY(offsetY - (centerY + squareY));
        }
    }

    // Обработчик отпускания кнопки мыши
    const handleCanvasMouseUp = () => {
        // Снимаем флаг перемещения
        setIsDragging(false);
    }

    // Обработчик движения мыши
    const handleCanvasMouseMove = (event) => {
        if (isDragging) {
            const { offsetX, offsetY } = event.nativeEvent;
            const centerX = canvasRef.current.width / 2;
            const centerY = canvasRef.current.height / 2;

            // Вычисляем расстояние от центра окружности до текущей позиции мыши
            const distance = Math.sqrt((offsetX - centerX) ** 2 + (offsetY - centerY) ** 2);
            // Максимальное расстояние от центра окружности, в пределах которого можно перемещать квадрат
            const maxDistance = circleRadius - squareSize / 2;

            if (distance <= maxDistance) {
                // Положение квадрата обновляется только внутри окружности
                setSquareX(Math.min(circleRadius - squareSize / 2, Math.max(-circleRadius + squareSize / 2, offsetX - centerX - dragOffsetX)));
                setSquareY(Math.min(circleRadius - squareSize / 2, Math.max(-circleRadius + squareSize / 2, offsetY - centerY - dragOffsetY)));

                // Оптимизация: используем requestAnimationFrame для отрисовки квадрата
                cancelAnimationFrame(animationFrameRef.current);
                animationFrameRef.current = requestAnimationFrame(() => {
                    drawCanvas();
                });
            }
        }
    }

    // Отрисовка квадрата на холсте
    const drawCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        context.beginPath();
        context.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
        context.fillStyle = 'lightgray';
        context.fill();

        context.fillStyle = 'blue';
        context.fillRect(centerX + squareX - squareSize / 2, centerY + squareY - squareSize / 2, squareSize, squareSize);
    };

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                onMouseDown={handleCanvasMouseDown}
                onMouseUp={handleCanvasMouseUp}
                onMouseMove={handleCanvasMouseMove}
            />
            <div>
                <label>Радиус окружности:
                    <input type="number" name="circleRadius" value={circleRadius} onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>Размер стороны квадрата:
                    <input type="number" name="squareSize" value={squareSize} onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>Координата X квадрата:
                    <input type="number" name="squareX" value={squareX} onChange={handleInputChange} />
                </label>
            </div>
            <div>
                <label>Координата Y квадрата:
                    <input type="number" name="squareY" value={squareY} onChange={handleInputChange} />
                </label>
            </div>
        </div>
    );
}

export default CircleWithSquare;
