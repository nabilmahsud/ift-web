import  { useEffect, useState } from 'react';
import axios from 'axios';
import type { Slider } from '../Types/Slider';
import SliderForm from '../Components/SliderForm';

export default function Dashboard() {
  const [sliders, setSliders] = useState<Slider[]>([]);

  useEffect(() => {
    axios.get('https://ifta-api.onrender.com/slider').then(res => setSliders(res.data.data));
  }, []);

  const handleUpdate = (updated: Slider) => {
    setSliders(prev =>
      prev.map(slide => (slide.index === updated.index ? updated : slide))
    );
  };

  return (
    <div>
      <h1>Admin Dashboard - Edit Sliders</h1>
      {sliders.map(slider => (
        <SliderForm key={slider.index} slider={slider} onUpdate={handleUpdate} />
      ))}
    </div>
  );
}
