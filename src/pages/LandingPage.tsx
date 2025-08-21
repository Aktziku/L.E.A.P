import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import '../components/LandingPage.css'
import heroImg from '/assets/heroimg.webp';
const LandingPage: React.FC = () => {
    return (
        <IonPage>
            <IonHeader className="ion-no-border">
                <IonToolbar color="transparent">
                    <IonTitle className="logo-title">LEAP</IonTitle>
                    <IonButtons slot="end" >
                        <IonButton 
                            fill="clear"
                            style={{ color: '#ffffff', background: '#007AFF', borderRadius: '25px', marginRight: '10px' }}
                            routerLink="/login"
                            >
                            Login
                        </IonButton>

                        <IonButton 
                            fill="clear"
                            style={{ color: '#ffffff', background: '#007AFF', borderRadius: '25px' }}
                            routerLink="/register" 
                            >
                            Register
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" scrollY={false}>
                <div className="landing-container">
                    <div className="hero-section">
                        <div className="hero-content">
                            <h1 className="main-title">Empowering Teens Through Knowledge</h1>
                            <p className="subtitle">
                                Join LEAP's mission to educate, support, and create awareness 
                                about teenage pregnancy prevention
                            </p>
                            <div className="cta-buttons">
                                <IonButton 
                                    size="large"
                                    className="get-started-btn"
                                    routerLink="/login"
                                >
                                    Get Started
                                </IonButton>
                            </div>
                        </div>
                        
                        <div className="hero-image">
                            <img
                                src={heroImg}
                                alt="LEAP Illustration"
                                className="main-illustration"
                            />
                        </div>
                    </div>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default LandingPage;