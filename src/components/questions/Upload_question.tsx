import { useState } from "react";

export default function SimpleQuestionForm() {
  const initialFormState = {
    subject: "मानसिक क्षमता परीक्षण",
    class: "NMMS",
    topic: "गणितीय संक्रियाएँ",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    questionImage: "",
    hint: { text: "", image: "", video: "" },
  };
   
  const [form, setForm] = useState(initialFormState);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("option")) {
      const index = parseInt(name.replace("option", ""));
      const updatedOptions = [...form.options];
      updatedOptions[index] = value;
      setForm({ ...form, options: updatedOptions });
    } else if (
      name === "hintText" ||
      name === "hintImage" ||
      name === "hintVideo"
    ) {
      setForm({
        ...form,
        hint: {
          ...form.hint,
          [name === "hintText"
            ? "text"
            : name === "hintImage"
            ? "image"
            : "video"]: value,
        },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };
 // this is main heading 
  const uploadToCloudinary = async (file, resource_type = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dmebh0vcd/${resource_type}/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      alert(`Upload failed: ${error.message}`);
      return null;
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const isVideo = type === "video";
      const uploadedUrl = await uploadToCloudinary(
        file,
        isVideo ? "video" : "image"
      );

      if (!uploadedUrl) throw new Error("Failed to get upload URL");

      if (type === "questionImage") {
        setForm({ ...form, questionImage: uploadedUrl });
      } else {
        setForm({
          ...form,
          hint: { ...form.hint, [type]: uploadedUrl },
        });
      }
    } catch (error) {
      console.error("File upload error:", error);
      alert(`File upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const response = await fetch("http://localhost:5000/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok)
        
        throw new Error(`Server responded with ${response.status}`);

      alert("Question uploaded successfully!");
      setForm(initialFormState);
    } catch (error) {
      console.error("Submission error:", error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
        padding: "24px",
        maxWidth: "672px",
        margin: "16px auto",
      }}
    >
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#1f2937",
          marginBottom: "16px",
        }}
      >
        Upload Question
      </h2>

      <div>
        {/* Basic Info */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
          <input
            type="text"
            name="class"
            value={form.class}
            onChange={handleChange}
            placeholder="Class/Grade"
            required
            style={{
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
            }}
          />
        </div>

        <input
          type="text"
          name="topic"
          value={form.topic}
          onChange={handleChange}
          placeholder="Topic"
          required
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        <textarea
          name="question"
          value={form.question}
          onChange={handleChange}
          placeholder="Question"
          required
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            minHeight: "64px",
            marginBottom: "16px",
            boxSizing: "border-box",
          }}
        />

        {/* Question Image Section */}
        <div style={{ marginBottom: "16px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: "500",
              marginBottom: "8px",
            }}
          >
            Question Image
          </label>
          <input
            type="url"
            name="questionImage"
            value={form.questionImage}
            onChange={handleChange}
            placeholder="Enter image URL or upload file below"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginBottom: "8px",
              boxSizing: "border-box",
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "questionImage")}
            style={{ width: "100%" }}
          />
          {form.questionImage && (
            <img
              src={form.questionImage}
              alt="Question"
              style={{
                marginTop: "8px",
                maxHeight: "128px",
                borderRadius: "6px",
              }}
            />
          )}
        </div>

        {/* Options */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {form.options.map((opt, index) => (
            <input
              key={index}
              type="text"
              name={`option${index}`}
              value={opt}
              onChange={handleChange}
              placeholder={`Option ${index + 1}`}
              required
              style={{
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
              }}
            />
          ))}
        </div>

        <select
          name="correctAnswer"
          value={form.correctAnswer}
          onChange={handleChange}
          required
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            marginBottom: "16px",
          }}
        >
          <option value="">Select correct option</option>
          {form.options.map((opt, index) => (
            <option key={index} value={opt} disabled={!opt}>
              {opt || `Option ${index + 1} (empty)`}
            </option>
          ))}
        </select>

        {/* Hints */}
        <div style={{ paddingTop: "8px", borderTop: "1px solid #d1d5db" }}>
          <textarea
            name="hintText"
            value={form.hint.text}
            onChange={handleChange}
            placeholder="Hint Text (Optional)"
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              marginBottom: "12px",
              boxSizing: "border-box",
            }}
          />

          {/* Hint Image Section */}
          <div style={{ marginBottom: "12px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Hint Image
            </label>
            <input
              type="url"
              name="hintImage"
              value={form.hint.image}
              onChange={handleChange}
              placeholder="Enter image URL or upload file below"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "image")}
              style={{ width: "100%" }}
            />
            {form.hint.image && (
              <img
                src={form.hint.image}
                alt="Hint"
                style={{
                  marginTop: "8px",
                  maxHeight: "128px",
                  borderRadius: "6px",
                }}
              />
            )}
          </div>

          {/* Hint Video Section */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "500",
                marginBottom: "8px",
              }}
            >
              Hint Video
            </label>
            <input
              type="url"
              name="hintVideo"
              value={form.hint.video}
              onChange={handleChange}
              placeholder="Enter video URL or upload file below"
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                marginBottom: "8px",
                boxSizing: "border-box",
              }}
            />
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, "video")}
              style={{ width: "100%" }}
            />
            {form.hint.video && !form.hint.video.includes("youtube.com") && (
              <video
                controls
                style={{
                  marginTop: "8px",
                  maxHeight: "128px",
                  borderRadius: "6px",
                }}
              >
                <source src={form.hint.video} type="video/mp4" />
                Your browser does not support video.
              </video>
            )}
            {form.hint.video && form.hint.video.includes("youtube.com") && (
              <iframe
                width="100%"
                height="180"
                src={form.hint.video.replace("watch?v=", "embed/")}
                title="YouTube preview"
                style={{ marginTop: "8px", borderRadius: "6px" }}
              ></iframe>
            )}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          style={{
            padding: "8px 16px",
            backgroundColor: uploading ? "#93c5fd" : "#2563eb",
            color: "white",
            borderRadius: "6px",
            width: "100%",
            border: "none",
            cursor: uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Processing..." : "Submit Question"}
        </button>
      </div>
    </div>
  );
}
