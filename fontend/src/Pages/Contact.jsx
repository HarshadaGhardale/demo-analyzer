import React, { useState } from "react";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("✅ Thank you! Your message has been sent.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus(`❌ Error: ${data.message || "Something went wrong"}`);
      }
    } catch (error) {
      setStatus("❌ Error submitting the form. Please try again later.");
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-16 bg-white text-gray-800 font-inter">
      <h1 className="text-6xl font-bold text-center mb-4 hover:scale-105 transition-transform duration-200 ease-in-out">
        Get In Touch
      </h1>
      <p className="text-center text-gray-600 max-w-xl mx-auto mb-12 hover:scale-105 transition-transform duration-200 ease-in-out">
        Have questions about our services? We’re here to help.
        <br />
        Fill out the form or use our contact information below.
      </p>

      <div className="flex flex-col lg:flex-row gap-12 justify-between items-start">
        {/* Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg bg-gray-100 border border-gray-200 shadow-md rounded-xl p-6 space-y-5 hover:scale-105 transition-transform duration-200 ease-in-out"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
          />
          <textarea
            name="message"
            rows="6"
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-gray-800"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-900 transition hover:scale-105 transition-transform duration-200 ease-in-out"
          >
            Send Message
          </button>

          {status && <p className="mt-3 text-center">{status}</p>}
        </form>

        {/* Contact Information */}
        <div className="w-full max-w-md space-y-6 hover:scale-105 transition-transform duration-200 ease-in-out">
          <div className="flex items-start gap-4">
            <i className="fas fa-envelope text-2xl text-gray-800 mt-1"></i>
            <div>
              <p className="font-semibold text-gray-800"> • Email</p>
              <p className="text-gray-600">sprush@gmail.com</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <i className="fas fa-phone text-2xl text-gray-800 mt-1"></i>
            <div>
              <p className="font-semibold text-gray-800"> • Phone</p>
              <p className="text-gray-600">+91 8483839575</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <i className="fas fa-location-dot text-2xl text-gray-800 mt-1"></i>
            <div>
              <p className="font-semibold text-gray-800">• Address</p>
              <p className="text-gray-600">India</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;