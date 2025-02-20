import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Doughnut, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Title, Tooltip, Legend );

const API_URL = `http://localhost:5000`;

const App = () => {
  const [folderPath, setFolderPath] = useState('');
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState('');
  const [chartData, setChartData] = useState(null);

  const setBaseFolder = async () => {
    try {
      await axios.post(`${API_URL}/set-folder`, { folderPath });
      alert('Успех: Базовая папка установлена');
      loadFiles();
    } catch (error) {
      alert('Ошибка: Не удалось установить базовую папку');
    }
  };

  const loadFiles = async () => {
    try {
      const res = await axios.get(`${API_URL}/files`);
      setFiles(res.data);
    } catch (err) {
      console.error('Ошибка загрузки файлов:', err);
      alert('Ошибка загрузки файлов');
    }
  };

  const loadFileContent = async (filename) => {
    try {
      const res = await axios.get(`${API_URL}/file/${filename}`);
      setSelectedFile(filename);
      const jsonData = JSON.parse(res.data.content);
      setChartData(jsonData);
    } catch (err) {
      alert('Ошибка загрузки содержимого');
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>
      <div style={{ width: '200px' }}>
        <h1>Выбранный файл: {selectedFile}</h1>
        <input
          placeholder="Путь к папке"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
        />
        <button onClick={setBaseFolder}>Установить папку</button>
        <h2>Файлы</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {files.map((file) => (
            <li
              key={file}
              onClick={() => loadFileContent(file)}
              style={{
                cursor: 'pointer',
                padding: '5px',
                background: selectedFile === file ? '#eee' : 'transparent'
              }}
            >
              {file}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 1 }}>
        {chartData && (
          <div style={{ marginTop: '10px' }}>
            <h2>График</h2>
            <Line data={chartData} />
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {chartData && (
          <div style={{ marginTop: '10px' }}>
            <h2>Бублик</h2>
            <Doughnut data={chartData} />
          </div>
        )}
      </div>
      <div style={{ flex: 1 }}>
        {chartData && (
          <div style={{ marginTop: '10px' }}>
            <h2>Пирог</h2>
            <Pie data={chartData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;