import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import heroImg from '/assets/heroimg.webp';

const LandingPage: React.FC = () => {
  return (
    <IonPage>
      {/* Transparent Sticky Header */}
      <IonHeader>
        <IonToolbar 
            style={{
            position: 'absolute',
            width: '100%',
            '--background': 'transparent',
            padding: '0 clamp(12px, 5vw, 40px',
            display: 'flex',
            justifyContent: 'space-between',
            height: '60px',
            alignItems: 'center',
          }}>
            <IonTitle 
                style={{
                    '--color': '#4C1D95',
                    fontWeight: '700',
                    fontSize : 'clamp(20px, 2vw, 550px)',
                    letterSpacing: '2px',
                }}>
                    LEAP
            </IonTitle>
                   
                <IonButton
                    routerLink="/login"
                    slot='end'
                    
                    style={{
                        '--background': 'linear-gradient(90deg, #6f50ccff, #7B61FF)',  
                        '--size': 'clamp(5px, 1vw, 14px)',
                        padding: '0 clamp(1px, 3vh, 20px)',
                        marginLeft: '2px',
                        fontWeight: 600,
                        fontSize: 'clamp(0.7rem, 2vw, 1rem)',

                }}>
                <span style={{color : '#ffffffff'}}>Login</span>
                </IonButton>
                    
                <IonButton
                    routerLink="/register"
                    slot='end'
                    style={{
                        '--background': 'linear-gradient(90deg, #6f50ccff, #7B61FF)',
                        '--size': 'clamp(1px, 1vw, 14px)',
                        padding: '0 clamp(1px, 1vh, 20px)',
                        marginLeft: '2px',
                        fontWeight: 600,
                        fontSize: 'clamp(0.7rem, 2vw, 1rem)',

                }}>
                <span style={{color : '#ffffffff'}}>Register</span>
                </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent scrollY={true} >

        <div 
            style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#ffff',
            minHeight: '100%',
            padding: 'clamp(40px, 10vh, 80px) clamp(16px, 5vw, 40px)',
        }}>

            {/* Hero Section */}
          <div 
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr   1fr',
            gap: 'clamp(20px, 5vw, 40px)',
            alignItems: 'center',
            maxWidth: '1200px',
            width: '100%',
            }}>

            {/* Hero Text */}
            <div>
                <h1 
                    style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        color: '#441886ff',
                        lineHeight: '1.2',
                    }}>
                    Empowering{' '}
                    <span
                    style={{ 
                        background: 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: '900',
                    }}>
                        Teens
                    </span>{' '}
                    <br /> Through{' '} 
                    <span 
                    style={{
                        background: 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        Knowledge
                    </span>
                </h1>

                {/* Hero Subtext */}
                <p
                    style={{
                        fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                        color: '#555',
                        marginTop: '20px',
                        marginBottom: '30px',
                        lineHeight: '1.5',
                        maxWidth: '600px',
                }}>
                Join LEAP’s mission to <strong>educate</strong>, <strong>support</strong>, 
                and raise <strong>awareness</strong> about teenage pregnancy prevention.
                </p>

                {/* Call to Action Buttons */}
                <div
                    style={{
                        marginTop: '24px',
                        display: 'flex',
                        gap: '16px',
                }}>
                    {/*Get Started Button */}
                    <IonButton
                        size="large"
                        routerLink="/login"
                        style={{
                        '--background' : 'linear-gradient(90deg, #a78bfa, #8b5cf6)',
                        color: '#ffffffff',
                        fontWeight: '600',
                        boxShadow: '0 4px 14px rgba(139, 92, 246, 0.39)',
                        minWidth: 'clamp(120px, 20vw, 160px)',
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                        borderRadius: '25px',
                    }}>
                     Get Started
                    </IonButton>

                    {/*Learn More Button */}
                    <IonButton
                        size="large"
                        routerLink="/about"
                        style={{
                        '--background': 'transparent',
                        '--color': '#4C1D95',
                        border: '2px solid #4C1D95',
                        fontWeight: '700',
                        transition: 'background 0.3s ease',
                        '&:hover': {
                            '--background': 'linear-gradient(90deg, #8b5cf6, #a78bfa)',
                        },
                        minWidth: 'clamp(120px, 20vw, 160px)',
                        fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
  
                    }}>
                    Learn More
                    </IonButton>
                </div>
            </div>

            {/* Hero Illustration */}
            <div 
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
            }}>

              <img
                    src={heroImg}
                    alt="LEAP Illustration"
                    className="main-illustration"
                    style={{
                        animation: "float 4s ease-in-out infinite",
                        maxWidth: '90%',
                        height: 'auto',
                    }}
              />
            </div>
          </div>
        </div>
        <style>
            {`
                @keyframes float {
                    0% {transform: translateY(0px);}
                    50% {transform: translateY(-10px);}
                    100% {transform: translateY(0px);}
                }
                
                @media (max-width: 768px) {
                    .ion-page div[style*="grid"] {
                    grid-template-columns: 1fr !important;
                    text-align: center;
              }
              .ion-page div[style*="flex"] {
                    justify-content: center !important;
              }
            }
            `}
        </style>
      </IonContent>
    </IonPage>
  );
};

export default LandingPage;
