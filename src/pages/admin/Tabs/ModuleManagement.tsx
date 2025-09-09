import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonModal, IonPage, IonSearchbar, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { logoIonic, searchOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';

const ModulesManagement: React.FC = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navigation = useIonRouter();
    
    {/* State for controlling the search modal visibility */}
    const [ShowSearchModal, setShowSearchModal] = useState(false);

    const handleLogout = () => {
        try {
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            navigation.push('/login', 'forward', 'replace');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <IonPage>
            <IonHeader 
            style={{ 
                '--background': '#4C1D95' 
                }}>
                    <IonToolbar style={{ 
                        '--background': '#4C1D95',
                        display: 'flex',
                        alignItems: 'center',
                            }}>
    
                        <IonImg 
                            className='ion-margin-left' 
                            slot='start' 
                            src={logoIonic} 
                            alt="Ionic Logo" 
                            style={{ 
                                width: 'clamp(30px, 5vw, 50px)',
                                height:'auto',
                                marginLeft: 'clamp(8px, 2vw, 16px)',
                            }} >
                        </IonImg>

                        <IonTitle 
                            className='ion-text-left' 
                            style={{ 
                                '--color': '#F3E8FF',
                                fontSize: 'clamp(14px, 2vw, 20px)',
                            }}>
                                Module Management
                        </IonTitle>

                        <IonButton
                            slot='end' 
                            size='small'       
                            style={{ 
                                marginRight: 'clamp(8px, 4vw, 50px)',
                                fontSize: 'clamp(10px, 1.5vw, 14px)',
                                '--background': '#EAB308',
                                '--color': '#4C1D95',
                                borderRadius: '20px',
                                padding: '0 12px',
                            }} 
                            onClick={handleLogout}>
                                Logout
                        </IonButton>
                    </IonToolbar>
                            
                    {/* Search bar and Add New Profile button */}
                    <IonToolbar 
                        style={{ 
                            '--border-width': '0',
                            '--background': '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap:'clamp(8px, 2vw, 20px)',
                            padding: '0 clamp(10px, 3vw,40px)',
                        }}>
                        
                        {!isMobile ? (
                            <>
                        <IonButton 
                            slot='start'
                            size='small'
                            style={{
                                fontSize: 'clamp(10px, 1.5vw, 14px)',
                                '--background': '#6D28D9',
                                'marginLeft': 'clamp(4px, 2vw, 40px)',
                                padding: '0 12px',
                                }}
                            >
                                Search
                        </IonButton>
    
                        <IonSearchbar 
                            placeholder="Search" 
                            style={{ 
                                flex: 1, 
                                maxWidth: 'clamp(180px, 80vw, 1000px)',
                                '--border-radius': '25px',
                                '--background': '#FFFFFF',
                                'borderRadius': '25px',
                                'border': '2px solid #EAB308',
                                '--color': '#4C1D95',
                                '--placeholder-color': '#4C1D95',
                                '--icon-color': '#4C1D95',
                                '--placeholder-opacity': '0.7',
                                '--box-shadow': 'none',
                                '--height': 'clamp(4px, 5vw, 70px)',
                                fontSize: 'clamp(1px, 1.5vw, 10px)',
                                'paddinginLine': 'clamp(12px, 2vw, 16px)',
    
                            }}>
                        </IonSearchbar>
    
                        
                        </>
                        ) : (
                        <IonButton 
                            fill="clear" 
                            slot="start"
                            onClick={() => setShowSearchModal(true)}
                        >
                                <IonIcon icon={searchOutline} style={{ fontSize: '24px', color: '#6D28D9' }} />
                        </IonButton>
                        )}

                        <IonButton 
                            size='small'
                            slot='end'
                            style={{
                                fontSize: 'clamp(10px, 1.5vw, 14px)',
                                '--background': '#6D28D9',
                                borderRadius: '20px',
                                padding: '0 12px',
                                }}>
                                Upload Module
                        </IonButton>

                    </IonToolbar>
                </IonHeader>
            <IonModal isOpen={ShowSearchModal} onDidDismiss={() => setShowSearchModal(false)}>
                <IonContent>
                    <IonSearchbar 
                        placeholder="Search"
                        debounce={300}
                        style={{ 
                            '--border-radius': '0px',   
                            '--background': '#FFFFFF',
                            borderRadius: '25px',
                            border: '2px solid #EAB308',
                            '--color': '#4C1D95',
                            '--placeholder-color': '#4C1D95',
                            '--icon-color': '#4C1D95',
                            '--placeholder-opacity': '0.7',
                            '--box-shadow': 'none',
                        }}>
                        </IonSearchbar>

                        <IonButton
                            expand='block'
                            color="medium"
                            style={{
                                marginTop: '16px',
                                borderRadius: '20px',
                        }}
                            onClick={() => setShowSearchModal(false)}
                        >
                            Close
                        </IonButton>
                </IonContent>
            </IonModal>
        </IonPage>
    );
};

export default ModulesManagement;