import {
    IonApp,
    IonContent,
    IonFooter,
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
    IonTabBar,
    IonTabButton,
    IonTitle,
    IonToolbar,
    useIonRouter
} from '@ionic/react';
import { Redirect, useLocation } from 'react-router-dom';
import { documentAttachOutline, gridOutline, logoIonic, logOutOutline, peopleOutline, personOutline, readerOutline, schoolOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Route } from 'react-router';
import AdminDashboard from './Tabs/AdminDashboard';
import ProfileManagement from './Tabs/ProfileManagement';
import Education from './Tabs/Education';
import { supabase } from '../../utils/supabaseClients';
import CaseManagement from './Tabs/CaseManagement';
import { Session } from '@supabase/supabase-js';
import UserManagement from './Tabs/UserManagement';
import HealthMonitoring from './Tabs/HealthMonitoring';

const AdminHome: React.FC = () => {
    const [isHovered, setIsHovered] = useState(false);
    const navigation = useIonRouter();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [importing, setImporting] = useState(false);
    
    const [userDetails, setUserDetails] = useState<{role:string} | null>(null);
    

    // array for sidebar items
    const roleTabs: Record<string,Array<{name:string;url:string;icon:string}>> = {
        admin: [
            { name: 'Dashboard', url: '/admin/dashboard', icon: gridOutline },
            { name: 'Profiling', url: '/admin/profiles', icon: peopleOutline },
            { name: 'Health Monitoring', url: '/admin/health', icon: readerOutline},
            { name: 'Education And Training', url: '/admin/education', icon: schoolOutline },
            { name: 'Case Management', url:'/admin/case', icon: documentAttachOutline },
            { name: 'User Management', url:'/admin/userManagement', icon: personOutline },
        ],

        healthworker: [ 
            { name: 'Dashboard', url: '/admin/dashboard', icon: gridOutline }, 
            { name: 'Health Monitoring', url: '/admin/health', icon: readerOutline},
        ],
        socialworker: [
            { name: 'Dashboard', url: '/admin/dashboard', icon: gridOutline },
            { name: 'Case Management', url: '/admin/case', icon: documentAttachOutline },
        ],
        school: [
            { name: 'Dashboard', url: '/admin/dashboard', icon: gridOutline },
            { name: 'Education And Training', url: '/admin/education', icon: schoolOutline },
        ],
    };

    const tabsToRender = userDetails?.role ? roleTabs[userDetails.role] || [] : [];

   // console.log(" Current Role:", userDetails?.role);
   // console.log(" Available Role Keys:", Object.keys(roleTabs));
    //console.log(" Tabs for this role:", tabsToRender);

    // Function to get current page title
    const getCurrentTitle = () => {
        const currentPath = location.pathname;
        const allTabs = Object.values(roleTabs).flat();
        const currentTab = allTabs.find(tab => tab.url === currentPath);
        return currentTab ? currentTab.name : 'Dashboard';
    };
    const fetchProfiles = async (id = "") => {
        if (!id) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq("auth_id", id)


            if (error) {
                setError(error.message);
                setToastMessage('Error fetching profiles');
                setShowToast(true);
                setUserDetails({ role: '' });
            }
            if (data && data.length > 0) {
                //console.log(data[0])
                setUserDetails({role:data[0].role})
                
            } else {
                 console.log("No role found for auth_id:", id);
                 setUserDetails({ role: '' });
            }
        }
        catch (error) {
            setError('An unexpected error occurred');
            setToastMessage('An unexpected error occurred');
            setShowToast(true);
        }
        finally {
            setLoading(false);
        }
    };
    //
    const [session, setSession] = useState<Session | null>(null)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
             setSession(session);
        })
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            fetchProfiles(session?.user.id)
        })
        return () => subscription.unsubscribe()
    }, [])
    
    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                console.error('Logout error:', error.message);
                return;
            }
            localStorage.clear();

            navigation.push('/', 'forward', 'replace');
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
                            '--background':'#002d54',
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

                            <IonTitle
                                className=''
                                style={{

                                    marginLeft: 'clamp(16px, 2vw, 22px)',
                                    fontSize: 'clamp(12px, 2vw, 20px)',
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
                                    width: 'clamp(200px, 40vw, 400px)',
                                    '--background': '#ffffffff',
                                    '--border-radius': '20px',
                                    '--placeholder-color': '#002d54',
                                    '--placeholder-opacity': '1',
                                    '--icon-color': '#000000ff',
                                    fontSize: 'clamp(10px, 1vw, 15px)',
                                    color: '#000000ff',
                                }}
                            >

                            </IonSearchbar>
                        </div>
                    </IonToolbar>
                </IonHeader>

                <IonContent>
                    <IonSplitPane when="sm" contentId="main">
                        {/* Sidebar */}
                        <div
                            style={{
                                width: isHovered ? '250px' : '60px',
                                transition: 'width 0.3s ease-in-out',
                                background: '#002d54',
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
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
                                {tabsToRender.map((item, index) => {
                                    const isActive = location.pathname === item.url;

                                    return (
                                            <IonItem
                                                key={index}
                                                routerLink={item.url}
                                                lines='none'
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    color: 'white',
                                                    '--background': isActive ? '#0d6efd' : 'transparent', 
                                                    '--color': '#ffffff',                              
                                                    margin: '8px 0px',
                                                    transition: '0.3s ease-in-out', 
                                                }}
                                            >
                                                <div>
                                                <IonIcon
                                                    icon={item.icon}
                                                    style={{
                                                        fontSize: '24px',
                                                        marginRight: isHovered ? '15px' : '0px',
                                                        color: isActive ? '#ffffff' : 'white',
                                                        transition: 'margin 0.3s ease-in-out, color 0.3s ease-in-out',
                                                    }}
                                                />
                                                </div>
                                                {isHovered && (
                                                    <IonLabel
                                                        style={{
                                                            color: isActive ? '#ffffff' : 'white',
                                                            opacity: isHovered ? 1 : 0,
                                                            whiteSpace: 'nowrap',
                                                            transition: 'color 0.3s ease-in-out',
                                                            fontWeight: isActive ? 'bold' : 'normal'
                                                        }}
                                                    >
                                                        {item.name}
                                                    </IonLabel>
                                                )}
                                            </IonItem>
                                        );
                                    })}


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
                                        transition: '0.3s ease-in-out',
                                        margin: '8px 0px',
                                        background: 'rgba(14, 0, 15, 0.15)',
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            width: '40px'
                                        }}
                                    >
                                        <IonIcon
                                            icon={logOutOutline}
                                            style={{
                                                fontSize: '24px',
                                                color: 'white',
                                                transition: 'margin 0.3s ease-in-out',
                                            }}
                                        />

                                    </div>

                                    {isHovered && (
                                        <div style={{ marginLeft: '8px' }}>
                                        <IonLabel
                                            style={{
                                                color: '#fdedf4ff',
                                                transition: 'color 0.3s ease-in-out',
                                                opacity: isHovered ? 1 : 0,
                                                whiteSpace: 'nowrap',
                                                fontWeight: 'bold',
                                              
                                            }}
                                        >
                                            LogOut
                                        </IonLabel>
                                        </div>
                                    )}

                                </IonItem>
                            </IonList>
                        </div>

                        {/* Main Content */}
                        <div
                            id="main"
                            style={{
                                flex: 1,
                                marginLeft: 0,
                                padding: 'clamp(10px, 2vw, 20px)',
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
                                <Route exact path="/admin/health" render={() => <HealthMonitoring />} />
                                <Route exact path="/admin/education" render={() => <Education />} />
                                <Route exact path="/admin/case" render={() => <CaseManagement />} />
                                <Route exact path="/admin/userManagement" render={() => <UserManagement />} />
                            </IonRouterOutlet>
                        </div>
                    </IonSplitPane>
                </IonContent>
            </IonPage>
        </IonApp>

    );
};

export default AdminHome;