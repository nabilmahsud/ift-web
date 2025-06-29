import React, { useState } from 'react';
import axios from 'axios';
import type { Slider } from '../Types/Slider';

interface Props {
  slider: Slider;
  onUpdate: (updated: Slider) => void;
}

export default function SliderForm({ slider, onUpdate }: Props) {
  const [form, setForm] = useState<Slider>({
    ...slider,
    title: slider.title || '',
    paragraph: slider.paragraph || '',
    buttonLabel: slider.buttonLabel || '',
    buttonUrl: slider.buttonUrl || '',
    buttonEnabled: slider.buttonEnabled ?? false,
    imageUrl: slider.imageUrl || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImg, setRemoveImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadImage = async (): Promise<string> => {
    console.log('[UPLOAD] Uploading image to backend...');
    const formData = new FormData();
    formData.append('image', imageFile as File); // field name should be 'image'

    try {
      const res = await axios.post('http://localhost:3000/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('[UPLOAD] Image uploaded. URL:', res.data.imageUrl);
      return res.data.imageUrl;
    } catch (err) {
      console.error('[UPLOAD ERROR]', err);
      return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    console.log('=== FRONTEND FORM SUBMIT ===');
    console.log('Slide Index:', form.index);

    let imageUrl = form.imageUrl;

    if (removeImg) {
      imageUrl = '';
      console.log('[IMG] Image will be removed');
    } else if (imageFile) {
      imageUrl = await uploadImage();
    }

    // Prepare multipart form data
    const payload = new FormData();
    payload.append('title', form.title);
    payload.append('paragraph', form.paragraph);
    payload.append('buttonEnabled', String(form.buttonEnabled));
    payload.append('buttonLabel', form.buttonLabel || '');
    payload.append('buttonLink', form.buttonUrl || '');
    payload.append('removeImage', String(removeImg));
    payload.append('imageUrl', imageUrl);

    if (imageFile && !removeImg) {
      payload.append('image', imageFile);
    }

    try {
      console.log('[PUT] Sending update to slide', form.index);
      const res = await axios.put(`http://localhost:3000/slider/${form.index}`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('[PUT] Response:', res.data);
      onUpdate({
        ...form,
        imageUrl,
      });
    } catch (error) {
      console.error('[PUT ERROR]', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Slide {form.index}</h2>

      <input
        type="text"
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Paragraph"
        value={form.paragraph}
        onChange={(e) => setForm({ ...form, paragraph: e.target.value })}
      />

      <input
        type="file"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />

      <div className="checkbox-group">
        <input
          type="checkbox"
          checked={removeImg}
          onChange={(e) => setRemoveImg(e.target.checked)}
        />
        <label>Remove Existing Image</label>
      </div>

      <div className="checkbox-group">
        <input
          type="checkbox"
          checked={form.buttonEnabled}
          onChange={(e) =>
            setForm({ ...form, buttonEnabled: e.target.checked })
          }
        />
        <label>Enable Button</label>
      </div>

      {form.buttonEnabled && (
        <>
          <input
            type="text"
            placeholder="Button Label"
            value={form.buttonLabel}
            onChange={(e) =>
              setForm({ ...form, buttonLabel: e.target.value })
            }
          />
          <input
            type="url"
            placeholder="Button URL"
            value={form.buttonUrl}
            onChange={(e) =>
              setForm({ ...form, buttonUrl: e.target.value })
            }
          />
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Update Slide'}
      </button>
    </form>
  );
}
