import { 
    IonApp, 
    IonContent, 
    IonHeader,
    IonIcon, 
    IonImg, 
    IonItem, 
    IonLabel, 
    IonList, 
    IonPage, 
    IonRouterOutlet, 
    
    IonSearchbar, 
    
    IonSplitPane,
    IonTitle,
    IonToolbar,
    useIonRouter 
} from '@ionic/react';
import { Redirect, useLocation } from 'react-router-dom';
import { gridOutline, logoIonic, logOutOutline, peopleOutline, readerOutline, schoolOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router';
import AdminDashboard from './Tabs/AdminDashboard';

import ProfileManagement from './Tabs/ProfileManagement';
import QuizManagement from './Tabs/QuizManagement';
import ModulesManagement from './Tabs/ModuleManagement';
import { supabase } from '../../utils/supabaseClients';

const AdminHome: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useIonRouter();
    const location = useLocation();
    
    // Function to get current page title
    const getCurrentTitle = () => {
        const currentPath = location.pathname;
        const currentTab = tabs.find(tab => tab.url === currentPath);
        return currentTab ? currentTab.name : 'Admin Dashboard';
    };
      
    // array for sidebar items
    const tabs = [
        {name: 'Dashboard', url: '/admin/dashboard', icon: gridOutline},
        {name: 'Profile Management', url: '/admin/profiles', icon: peopleOutline},
        {name: 'Quiz Management', url: '/admin/quiz', icon: schoolOutline},
        {name: 'Module Management',  url: '/admin/modules', icon: readerOutline},
    ];

    const handleLogout = async () => {
        try {
            const {error} = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error.message);
                return;
            }
            localStorage.clear();
            
            navigation.push('/login', 'forward', 'replace');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <IonApp>
            <IonPage>
                <IonHeader>

                    <IonToolbar
                        style={{
                            '--background': 'linear-gradient(90deg, #f48fb1, #ba68c8)',
                            '--border-width': '0',
                            '--min-height': '60px',
                            '--border-shadow': '0'
                        }}
                    >
                    {/* Logo and Title */}
                        <div style={{
                                display: 'flex', 
                                alignItems: 'center' 
                            }}
                                slot='start'
                        >

                            <IonImg 
                                className='ion-margin-left' 
                                slot='start' 
                                src={logoIonic} 
                                alt="Ionic Logo" 
                                style={{ 
                                    width: 'clamp(30px, 5vw, 50px)',
                                    height:'auto',
                                    marginLeft: 'clamp(8px, 2vw, 16px)',
                                }}
                            >
                            </IonImg>

                            <IonTitle
                                className=''
                                    style={{
                                        marginTop: 'auto',
                                        marginBottom: 'auto',
                                        marginLeft: 'clamp(8px, 2vw, 16px)',
                                        fontSize: 'clamp(20px, 2vw, 30px)',
                                        color: '#F3E8FF',
                                    }}
                                >
                                    {getCurrentTitle()}
                            </IonTitle>
                        </div>

                        {/* Searchbar */}
                        <div style={{ 
                                display: 'flex', 
                                alignItems: 'center' 
                                }}
                                slot='end'
                        >
                            <IonSearchbar
                                    className='ion-margin-end'
                                    placeholder="Search"
                                    style={{
                                        width: 'clamp(150px, 30vw, 400px)',
                                        '--background': '#ffffffff',
                                        '--border-radius': '20px',
                                        '--placeholder-color': '#e68feeff',
                                        '--placeholder-opacity': '1',
                                        '--icon-color': '#faa5faff',
                                        fontSize: 'clamp(12px, 1.5vw, 16px)',
                                        color : '#faa5faff',
                                    }}
                            >

                            </IonSearchbar>
                        </div>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonSplitPane 
                         when= "md"
                        contentId="main"
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            height: '100%',
                        }}
                    >
                        {/* Sidebar */}
                        <div
                            style={{ 
                                width: isHovered ? '250px' : '60px', 
                                transition: 'width 0.3s ease-in-out',
                                background: 'linear-gradient(180deg, #c48aceff, #f8adc6ff)',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                overflow: 'hidden',
                                boxShadow: '2px 0 6px rgba(0,0,0,0.15)',
                            }}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <IonList
                                style={{ 
                                    background: 'transparent', 
                                    marginTop: '10px' 
                                }}
                            >
                                {tabs.map((item, index) => (
                                    <IonItem
                                        key={index}
                                        routerLink={item.url}
                                        lines='none'
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            color: 'white',
                                            '--background': 'transparent',
                                            '--color': 'white',
                                            '--border-style': 'none',
                                            '--border-width': '0',
                                            '--inner-border-width': '0',
                                            '--highlight-height': '0',
                                            borderRadius: '12px',
                                            margin: '8px 0px',
                                        }}
                                    >
                                    <div>
                                        <IonIcon 
                                            icon={item.icon} 
                                            style={{ 
                                                fontSize: '24px', 
                                                marginRight: isHovered ? '15px' : '0px', 
                                                color: 'white',
                                                transition: 'margin 0.3s ease-in-out',
                                            }} 
                                        />
                                    </div>

                                        {isHovered && (
                                            <IonLabel
                                                style={{ 
                                                    color: 'white',
                                                    transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                                    opacity: isHovered ? 1 : 0,
                                                    whiteSpace: 'nowrap',
                                                    overFlow: 'hidden',
                                                }}
                                            >
                                                {item.name}
                                            </IonLabel>
                                        )}
                                    </IonItem>
                                ))}
                            </IonList>

                            {/* Logout Button */}
                            <IonItem
                               lines='none'
                                button
                                onClick={handleLogout}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: '#fdedf4ff',
                                    '--background': 'transparent',
                                    '--color': 'white',
                                    
                                    margin: '8px 0px',
                                    background: 'rgba(14, 0, 15, 0.15)',
                                }}
                            >
                                <div
                                    style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        width: '40px' }}
                                >
                                    <IonIcon 
                                        icon={logOutOutline} 
                                        style={{ 
                                            fontSize: '24px',
                                            color: 'white',
                                            marginRight: isHovered ? '15px' : '0px',
                                            transition: 'margin 0.3s ease-in-out',
                                        }} 
                                    />
                                </div>

                                {isHovered && (
                                            <IonLabel
                                                style={{ 
                                                    color: '#fdedf4ff',
                                                    transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',
                                                    opacity: isHovered ? 1 : 0,
                                                    whiteSpace: 'nowrap',
                                                    fontWeight: 'bold',
                                                    overFlow: 'hidden',
                                                }}
                                            >
                                                LogOut
                                            </IonLabel>
                                        )}
                                
                            </IonItem>
                        </div>

                        {/* Main Content */}
                        <div 
                            id="main"
                            style={{
                                flex: 1,
                                marginLeft: 0,
                                padding: '20px',
                                overflow: 'auto',
                                background: '#fdf6f9'
                            }}
                        >
                            <IonRouterOutlet>
                                <Route path="/admin" exact>
                                    <Redirect to="/admin/dashboard" />
                                </Route>
                                <Route exact path="/admin/dashboard" render={() => <AdminDashboard />} />
                                <Route exact path="/admin/profiles" render={() => <ProfileManagement />} />
                                <Route exact path="/admin/quiz" render={() => <QuizManagement />} />
                                <Route exact path="/admin/modules" render={() => <ModulesManagement />} />
                            </IonRouterOutlet>
                        </div>
                    </IonSplitPane>
                </IonContent>
            </IonPage>
        </IonApp>
        
    );
};

export default AdminHome;