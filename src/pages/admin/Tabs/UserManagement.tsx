import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToast, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { use, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import { addOutline } from 'ionicons/icons';
import AddUserModal from '../../../components/AddUserModal';


const UserManagement: React.FC = () => {
    const [users,setUsers] =useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    useIonViewWillEnter(() => {
        console.log("UserManagement view entered");
        setLoading(true);
        fetchUsers();
    });
    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) {
                setError(error.message);
                setToastMessage('Error fetching users');
                setShowToast(true);
            }
            if (data) {
                console.log("Fetched users:", data);
                setUsers(data);
            }
        } catch (error) {
            setError('An unexpected error occurred');
            setToastMessage('An unexpected error occurred');
            setShowToast(true); 
        }
        finally {
            setLoading(false);
        }
    };

    {/* rendering based on loading state */}
        if (loading) {
            return (
                <IonPage>
                    <IonContent
                        style={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            '--background': '#ffffffff',
                        }}
                    >
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 4px 12px rgba(90, 45, 109, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px',
                            gap: '1rem'
                        }}>
                            <IonSpinner
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    '--color': '#002d54',
                                }}
                            />
                            <IonText
                                style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: '#002d54',
                                }}
                            >
                                Loading profiles...
                            </IonText>
                        </div>
                    </IonContent>
                </IonPage>
            );
        }

    return (
        <IonPage>
            <IonContent style={{ '--background': '#ffffffff' }}>
                <div className="ion-padding">
                    <div className="ion-margin-bottom ion-margin-top">

                            {/*Button for adding profiles */}
                        <IonButton
                            className="ion-margin-end"
                            onClick={() => {
                                console.log("Opening Add User Modal");
                                setShowAddModal(true);
                                //setIsEditing(false);
                                //setEditingProfile(null);
                            }}
                            style={{
                                '--background': '#002d54',
                                color: 'white',
                                borderRadius: '12px',
                            }}
                        >
                            <IonIcon icon={addOutline} slot="start" />
                            Add User
                        </IonButton>
                    </div>

                    {error && (
                        <div className="ion-margin-bottom ion-color-danger">
                            <IonText color="danger">{error}</IonText>
                        </div>
                    )}

                    <IonGrid>
                        <IonCard style={{ border: "1px solid #000",'--background':'#ffffffff' }}>
                            <IonCardContent >
                                <IonGrid>

                                    {/* Table Header */}
                                    <IonRow
                                        style={{
                                        borderBottom: "1px solid #000",
                                        fontWeight: "bold",
                                        color: "#000",
                                        }}
                                    >
                                        <IonCol>User Name</IonCol>
                                        <IonCol>Role</IonCol>
                                        <IonCol size="3">Action</IonCol>
                                    </IonRow>

                                    {users.map((user,index) => (
                                        <IonRow
                                            key={index}
                                            style={{
                                            borderBottom: "1px solid #000",
                                            color: "#000",
                                            }}
                                        >
                                            <IonCol>{user.username}</IonCol>
                                            <IonCol>{user.role}</IonCol>
                                            <IonCol size="3">
                                                <IonButton
                                                    size="small"
                                                        fill="outline"
                                                        color="black"
                                                        style={{
                                                            
                                                            color: "#000",
                                                            marginRight: "5px",
                                                        }}
                                                    
                                                >
                                                    Edit
                                                </IonButton>
                                                <IonButton
                                                    size="small"
                                                        fill="outline"
                                                        color="black"
                                                        style={{
                                                            
                                                            color: "#000",
                                                            marginRight: "5px",
                                                        }}
                                                    >
                                                        Delete
                                                    </IonButton>
                                                </IonCol>
                                        </IonRow>

                                    ))}
                                </IonGrid>
                            </IonCardContent>
                        </IonCard>
                    </IonGrid>
                </div>

                <IonToast
                    isOpen = {showToast}
                    onDidDismiss = {() => setShowToast(false)}
                    message = {toastMessage}
                    duration = {3000}
                    position = "bottom"
                />

                <AddUserModal 
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={async (userData) => {
                        console.log("Saved user:", userData);
                        await fetchUsers();
                        setToastMessage('User added successfully');
                        setShowToast(true);
                    }}
                    />
            </IonContent>
        </IonPage>
    );
};

export default UserManagement;