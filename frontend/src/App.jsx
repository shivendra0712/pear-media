import React, { useState } from "react";
import TextFlow from "./components/TextFlow";
import ImageFlow from "./components/ImageFlow";

export default function App(){
  const [images, setImages] = useState([]);
  const [raw, setRaw] = useState(null);

  return (
    <div className="w-full h-screen ">
    
      <div className="flex justify-between">
          <TextFlow  />
          <hr />
          <ImageFlow  />
      </div>
    </div>
  );
}
