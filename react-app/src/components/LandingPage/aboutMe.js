import React from "react";
import './aboutMe.css'

function AboutModalContent() {
  return (
    <div className="about-modal-content">
      <h2 className="about-modal-title">Welcome to SparMe</h2>
      <p className="about-modal-description">
        SparMe is a comprehensive sparring session app designed to enhance your training experience and connect you with sparring partners. With SparMe, you can find like-minded individuals, schedule sparring sessions, and track your progress in a convenient and user-friendly platform.
      </p>
      <div className="about-modal-features">
        <h3>Key Features:</h3>
        <ul>
          <li>Find Sparring Partners</li>
          <li>Schedule Sessions</li>
          <li>Track Progress</li>
          <li>Personalized Dashboard</li>
          <li>Community Interaction</li>
          <li>User-Friendly Interface</li>
          <li>Privacy and Security</li>
        </ul>
      </div>
      <div className="about-modal-community">
        <h3>Community Interaction:</h3>
        <p>
          SparMe fosters a vibrant community of martial artists where you can interact with other practitioners, exchange knowledge, and share experiences. You can join discussion forums, participate in groups, and engage in conversations centered around sparring techniques, training strategies, and martial arts disciplines.
        </p>
      </div>
      <div className="about-modal-interface">
        <h3>User-Friendly Interface:</h3>
        <p>
          SparMe boasts a user-friendly interface that prioritizes ease of use and navigation. The intuitive design ensures that you can quickly access the desired features, update session details, and manage your profile effortlessly.
        </p>
      </div>
      <div className="about-modal-privacy">
        <h3>Privacy and Security:</h3>
        <p>
          SparMe prioritizes the privacy and security of its users. Personal information is protected, and communication between users is conducted within a secure environment. SparMe is committed to maintaining a safe and respectful community for all users.
        </p>
      </div>
      <p className="about-modal-summary">
        Overall, SparMe empowers martial artists by providing a comprehensive platform to connect, schedule, and track sparring sessions. Whether you're an amateur looking to gain experience or a seasoned practitioner seeking challenging opponents, SparMe is your go-to app for enhancing your sparring journey and connecting with a supportive community of martial arts enthusiasts.
      </p>
    </div>
  );
}

export default AboutModalContent;
