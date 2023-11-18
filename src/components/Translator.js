import React, { useState, useRef } from 'react';
import axios from 'axios';

function Translator() {
  const [fromLang, setFromLang] = useState('en');
  const [toLang, setToLang] = useState('hi');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [image, setImage] = useState(null);
  const videoRef = useRef(null);

  const translateText = () => {
    axios
      .post('/translate', { from_lang: fromLang, to_lang: toLang, text })
      .then((response) => {
        setTranslatedText(response.data.translated_text);
      })
      .catch((error) => {
        console.error('Translation failed', error);
      });
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImage(file); 

    const reader = new FileReader();
    reader.onload = (e) => {
      const imagePreview = document.getElementById('image-preview');
      if (imagePreview) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);

    
    const formData = new FormData();
    formData.append('image', file);

    axios
      .post('/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((response) => {
        console.log('Image uploaded to the server:', response.data);
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
      });
  }
};


  const openCamera = () => {
    const constraints = { video: true, audio: false };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  };
   return (
    <div className="translator">
      <h1>TRANSMANIA</h1>
      <form className="translation-form">
        <div className="select-container">
          <select onChange={(e) => setFromLang(e.target.value)} className="select-language">
          <option>--Select--</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="te">Telugu</option>
          </select>
          <span> TO </span>
          <select onChange={(e) => setToLang(e.target.value)} className="select-language">
            {/* Language options */}
            <option>--Select--</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="kn">Kannada</option>
            <option value="te">Telugu</option>
          </select>
        </div>
        <div className="text-container">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to translate"
            className="input-text"
           ></textarea>
           <textarea
          value={translatedText} 
          onChange={(e) => setTranslatedText(e.target.value)} 
          placeholder="Translated text"
          className="output-text"
        ></textarea>
          <div className="image-upload">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="image-input" />
            {image && (
              <div className="image-preview">
                <img src={URL.createObjectURL(image)} alt="Selected" />
              </div>
            )}
          </div>
          <div>
            <button onClick={openCamera} className="camera-button">Open Camera</button>
          </div>
          <button onClick={translateText} className="translate-button">Translate</button>
        </div>
        {/* {translatedText && (
          <div className="translated-text">
            <p>{translatedText}</p>
          </div>
        )} */}
        
      </form>
    </div>
  );
}

export default Translator;
