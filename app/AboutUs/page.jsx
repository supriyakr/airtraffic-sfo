import React from 'react';
import Image from 'next/image';
import styles from './AboutUs.module.css';

const AboutUs = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>About the Project</h1>
      <p className={styles.description}>
        This project is about showcasing data visualizations using San Francisco International Airport's open source data provided by SF.gov. We have created this project for the Course of CSC 805 Data Visualization at San Francisco State University by Professor Shahrukh Humayoun. This Next.js web application fetches the data from a PostgreSQL database and the interactive visualizations are created using D3.js! Hover around with your mouse pointer to play around!
      </p>

      <h2 className={styles.subheading}>Meet the Team!</h2>
      <div className={styles.teamContainer}>
        <div className={styles.teamMember}>
          <Image src="/shail.jpg" alt="Shail Patel" width={200} height={200} className={styles.teamPhoto} />
          <p className={styles.teamName}>Shail Patel</p>
          <p className={styles.university}>San Francisco State University</p>
        </div>
        <div className={styles.teamMember}>
          <Image src="/anh.jpg" alt="Anh Nguyen" width={200} height={200} className={styles.teamPhoto} />
          <p className={styles.teamName}>Anh Nguyen</p>
          <p className={styles.university}>San Francisco State University</p>
        </div>
        <div className={styles.teamMember}>
          <Image src="/supriya.jpg" alt="Supriya Rangaswamy" width={200} height={200} className={styles.teamPhoto} />
          <p className={styles.teamName}>Supriya Rangaswamy</p>
          <p className={styles.university}>San Francisco State University</p>
        </div>
        <div className={styles.teamMember}>
          <Image src="/monisha.jpeg" alt="Monisha Mekala" width={200} height={200} className={styles.teamPhoto} />
          <p className={styles.teamName}>Monisha Mekala</p>
          <p className={styles.university}>San Francisco State University</p>
        </div>
      </div>
    </div>
  );
};

export default function About() {
  return <AboutUs />;
}