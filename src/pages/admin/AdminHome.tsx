import { IonButton, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonPage, IonRoute, IonRouterOutlet, IonSearchbar, IonTabBar, IonTabButton, IonTabs, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import { Redirect } from 'react-router-dom';
import { gridOutline, logoIonic, peopleOutline, readerOutline, schoolOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router';
import AdminDashboard from './Tabs/AdminDashboard';

import ProfileManagement from './Tabs/ProfileMangement';
import QuizManagement from './Tabs/QuizManagement';
import ModulesManagement from './Tabs/ModuleManagement';

const AdminHome: React.FC = () => {
      
    // array for tabs
    const tabs = [
        {name: 'Dashboard', tab:'dashboard', url: '/admin/dashboard', icon: gridOutline},
        {name: 'Profile Management', tab:'profiles', url: '/admin/profiles', icon: peopleOutline},
        {name: 'Quiz Management', tab:'quiz', url: '/admin/quiz', icon: schoolOutline},
        {name: 'Module Management', tab:'modules', url: '/admin/modules', icon: readerOutline},
    ];

    return (

            <IonTabs>

                {/*Tab bar */}
                <IonTabBar 
                    slot="bottom" 
                    style = {{
                        '--background': '#ffffff',
                        '--color': '#4C1D95',
                        '--color-selected': '#dfc7fa',
                        borderTop: '1px solid #ddd',
                        height: 'clamp(75px, 1vh, 80px)',
                    }} >
                        {tabs.map((item, index) => (
                            <IonTabButton 
                                key={index} 
                                tab={item.tab} 
                                href={item.url}
                                style={{
                                    flexDirection: 'column',                
                                    padding: 'clamp(4px, 1vh, 75px)',}}>
                                    <IonIcon icon={item.icon}
                                        style={{
                                            fontSize: 'clamp(18px, 2.5vw, 26px)',
                                        }}                                />
                                    <IonLabel>{item.name}</IonLabel>
                            </IonTabButton>
                ))} 

                </IonTabBar>

            {/*Router outlet for tabs */}
                <IonRouterOutlet>
                            <Route  path="/admin">
                                <Redirect to="/admin/dashboard" />
                            </Route>
                            <Route exact path="/admin/dashboard" render={() => <AdminDashboard/>}/>
                            <Route exact path="/admin/profiles" render={() => <ProfileManagement/>}/>
                            <Route exact path="/admin/quiz" render={() => <QuizManagement/>}/>
                            <Route exact path="/admin/modules" render={() => <ModulesManagement/>}/>
                            
                </IonRouterOutlet>

            </IonTabs>
        
    );
};

export default AdminHome;