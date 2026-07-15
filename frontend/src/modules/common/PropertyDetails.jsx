import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  // Booking Form State
  const [bookingData, setBookingData] = useState({
    moveInDate: "",
    contactNumber: "",
    message: "",
  });
  const [isBookedSuccessfully, setIsBookedSuccessfully] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/users/properties/${id}`);
        if (response.data && response.data.success) {
          setProperty(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching property details:", error);
        toast.error("Property not found");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyDetails();
  }, [id, navigate]);

  useEffect(() => {
    setSelectedImage(0);
  }, [property]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateBooking = () => {
    const errors = {};
    if (!bookingData.moveInDate) {
      errors.moveInDate = "Move-in date is required";
    } else {
      const selectedDate = new Date(bookingData.moveInDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.moveInDate = "Move-in date cannot be in the past";
      }
    }

    if (!bookingData.contactNumber) {
      errors.contactNumber = "Contact phone number is required";
    } else if (!/^\d{10,15}$/.test(bookingData.contactNumber)) {
      errors.contactNumber = "Phone number must be between 10 and 15 digits";
    }
    return errors;
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const errors = validateBooking();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/users/bookings", {
        propertyId: id,
        ...bookingData,
      });

      if (response.data && response.data.success) {
        setIsBookedSuccessfully(true);
        toast.success("Your booking request was submitted successfully!");
      } else {
        toast.error(response.data.message || "Booking submission failed");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Network error submitting booking request",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </div>
    );
  }

  if (!property) return null;

  const images =
    property.images && property.images.length > 0
      ? property.images.map((img) =>
          img.startsWith("http") ? img : `http://localhost:8000${img}`,
        )
      : [
          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
        ];

  const detailsLayout = {
    maxWidth: "1200px",
    margin: "3rem auto",
    padding: "0 1.5rem",
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "2.5rem",
  };

  return (
    <div className="app-container">
      <Navbar />

      {/* Property Display Hero Banner */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "2rem auto",
          padding: "0 1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Main Image */}
        <img
          src={images[selectedImage]}
          alt={property.title}
          style={{
            width: "700px",
            maxWidth: "100%",
            height: "500px",
            objectFit: "cover",
            borderRadius: "18px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          }}
        />

        {/* Thumbnails */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            marginTop: "20px",
            flexWrap: "wrap",
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Property ${index + 1}`}
              onClick={() => setSelectedImage(index)}
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                cursor: "pointer",
                borderRadius: "10px",
                border:
                  selectedImage === index
                    ? "3px solid #4F46E5"
                    : "2px solid #ddd",
                transform: selectedImage === index ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      </div>

      <div style={detailsLayout}>
        {/* Left Side: Property Specs */}
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
            <span
              className="badge badge-approved"
              style={{
                backgroundColor: "var(--primary-light)",
                color: "var(--primary-base)",
              }}
            >
              {property.propertyType}
            </span>
            <span className="badge badge-approved">{property.listingType}</span>
            <span
              className={`badge ${property.available ? "badge-approved" : "badge-rejected"}`}
            >
              {property.available ? "Available" : "Rented"}
            </span>
          </div>

          <h1
            style={{
              fontSize: "2.25rem",
              marginBottom: "0.75rem",
              lineHeight: "1.2",
            }}
          >
            {property.title}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--slate-500)",
              fontSize: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <svg
              width="18"
              height="18"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
            </svg>
            <span>
              {property.address}, {property.city}, {property.state} -{" "}
              {property.pincode}
            </span>
          </div>

          {/* Quick specs bar */}
          <div
            style={{
              display: "flex",
              gap: "2.5rem",
              borderTop: "1px solid var(--slate-200)",
              borderBottom: "1px solid var(--slate-200)",
              padding: "1.25rem 0",
              marginBottom: "2rem",
            }}
          >
            <div>
              <p style={{ color: "var(--slate-500)", fontSize: "0.85rem" }}>
                Bedrooms
              </p>
              <h3 style={{ fontSize: "1.2rem" }}>{property.bedrooms} Beds</h3>
            </div>
            <div>
              <p style={{ color: "var(--slate-500)", fontSize: "0.85rem" }}>
                Bathrooms
              </p>
              <h3 style={{ fontSize: "1.2rem" }}>{property.bathrooms} Baths</h3>
            </div>
            <div>
              <p style={{ color: "var(--slate-500)", fontSize: "0.85rem" }}>
                Furnishing
              </p>
              <h3 style={{ fontSize: "1.2rem", textTransform: "capitalize" }}>
                {property.furnishing}
              </h3>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Property Description
            </h2>
            <p
              style={{
                color: "var(--slate-600)",
                lineHeight: "1.7",
                whiteSpace: "pre-line",
              }}
            >
              {property.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div style={{ marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
              Amenities Offered
            </h2>
            {property.amenities.length === 0 ? (
              <p style={{ color: "var(--slate-500)" }}>
                No amenities specified by host.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "1rem",
                }}
              >
                {property.amenities.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      color: "var(--slate-700)",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      style={{ color: "var(--success)" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Landlord details */}
          <div
            className="card"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.5rem",
              backgroundColor: "var(--slate-100)",
              borderColor: "var(--slate-200)",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "var(--primary-light)",
                color: "var(--primary-base)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: "1.25rem",
              }}
            >
              {property.ownerId?.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ color: "var(--slate-500)", fontSize: "0.85rem" }}>
                Listed by Host
              </p>
              <h3 style={{ fontSize: "1.15rem", marginBottom: "0.25rem" }}>
                {property.ownerId?.name}
              </h3>
              <p style={{ color: "var(--slate-600)", fontSize: "0.9rem" }}>
                Contact Email: {property.ownerId?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Booking Panel */}
        <div>
          <div className="card" style={{ position: "sticky", top: "100px" }}>
            <div
              style={{
                borderBottom: "1px solid var(--slate-100)",
                paddingBottom: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.75rem",
                  fontWeight: 800,
                  color: "var(--primary-base)",
                }}
              >
                ₹{property.rentAmount.toLocaleString()}
                <span
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 500,
                    color: "var(--slate-500)",
                  }}
                >
                  /mo
                </span>
              </span>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "0.5rem",
                  fontSize: "0.85rem",
                  color: "var(--slate-500)",
                }}
              >
                <span>Security Deposit:</span>
                <span style={{ fontWeight: 600 }}>
                  ₹{property.securityDeposit.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Check Renter/User Session States */}
            {!user ? (
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    color: "var(--slate-500)",
                    fontSize: "0.95rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  You must be logged in as a Renter to book this property.
                </p>
                <Link to="/login" className="btn btn-primary btn-block">
                  Login to Book
                </Link>
              </div>
            ) : user.role === "owner" || user.role === "admin" ? (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "var(--warning-light)",
                  color: "var(--warning)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: 500,
                }}
              >
                Booking is only available for Renters. Hosts and Admins cannot
                book listed properties.
              </div>
            ) : !property.available ? (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "var(--error-light)",
                  color: "var(--error)",
                  borderRadius: "var(--radius-sm)",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                This property has already been leased or is currently
                unavailable.
              </div>
            ) : isBookedSuccessfully ? (
              <div style={{ textAlign: "center", padding: "1rem" }}>
                <div
                  style={{
                    color: "var(--success)",
                    fontSize: "2.5rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  ✓
                </div>
                <h4 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>
                  Request Submitted!
                </h4>
                <p
                  style={{
                    color: "var(--slate-500)",
                    fontSize: "0.85rem",
                    marginBottom: "1rem",
                  }}
                >
                  The landlord has been notified and will review your request.
                </p>
                <Link
                  to="/user/bookings"
                  className="btn btn-secondary btn-block"
                >
                  View My Bookings
                </Link>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>
                  Request Booking
                </h3>

                <div className="form-group">
                  <label className="form-label">Intended Move-In Date *</label>
                  <input
                    type="date"
                    name="moveInDate"
                    value={bookingData.moveInDate}
                    onChange={handleInputChange}
                    className="form-input"
                    style={
                      formErrors.moveInDate
                        ? { borderColor: "var(--error)" }
                        : {}
                    }
                  />
                  {formErrors.moveInDate && (
                    <span
                      style={{
                        color: "var(--error)",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      {formErrors.moveInDate}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone Number *</label>
                  <input
                    type="text"
                    name="contactNumber"
                    placeholder="e.g. 9876543210"
                    value={bookingData.contactNumber}
                    onChange={handleInputChange}
                    className="form-input"
                    style={
                      formErrors.contactNumber
                        ? { borderColor: "var(--error)" }
                        : {}
                    }
                  />
                  {formErrors.contactNumber && (
                    <span
                      style={{
                        color: "var(--error)",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                        display: "block",
                      }}
                    >
                      {formErrors.contactNumber}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Introduce yourself or ask questions about move-in requirements..."
                    value={bookingData.message}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{ resize: "none" }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-block"
                  style={{ marginTop: "1rem" }}
                >
                  {isSubmitting
                    ? "Sending Request..."
                    : "Submit Booking Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
