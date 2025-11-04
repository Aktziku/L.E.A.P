import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSkeletonText, IonSpinner, IonText, IonTitle, IonToast, IonToolbar, useIonViewDidEnter, useIonViewWillEnter } from '@ionic/react';
import React, { use, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import { addOutline } from 'ionicons/icons';
import AddUserModal from '../../../components/AddUserModal';

interface UserManagementProps {
    searchQuery?: string;
}
const UserManagement: React.FC<UserManagementProps> = ({ searchQuery = '' }) => {
    const [users,setUsers] =useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    
    useIonViewWillEnter(() => {
        //console.log("UserManagement view entered");
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
                //console.log("Fetched users:", data);
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

    const filteredUsers = users.filter(user => {
        if (!searchQuery) return true;
        const fullName = `${user.firstname || ''} ${user.lastname || ''}`.toLowerCase();
        const email = (user.email || '').toLowerCase();
        const username = (user.username || '').toLowerCase();
        return fullName.includes(searchQuery.toLowerCase()) ||
            email.includes(searchQuery.toLowerCase()) ||
            username.includes(searchQuery.toLowerCase());
    });

    {/* rendering based on loading state */}
    if (loading) {
        return (
                <IonPage>
                    <IonContent style={{ '--background': '#ffffffff' }}>
                        <div className="ion-padding">
                            <div className="ion-margin-bottom ion-margin-top">
                                <IonSkeletonText animated style={{ width: '150px', height: '44px', borderRadius: '12px' }} />
                            </div>

                            <IonCard style={{ border: "1px solid #000" }}>
                                <IonCardContent>
                                    <IonGrid style={{ "--ion-grid-column-padding": "8px" }}>
                                        {/* Header Skeleton */}
                                        <IonRow style={{ borderBottom: "1px solid #000", paddingBottom: '10px', marginBottom: '10px' }}>
                                            <IonCol size="4"><IonSkeletonText animated style={{ width: '60%', height: '16px' }} /></IonCol>
                                            <IonCol size="4"><IonSkeletonText animated style={{ width: '70%', height: '16px' }} /></IonCol>
                                            <IonCol size="4"><IonSkeletonText animated style={{ width: '50%', height: '16px' }} /></IonCol>
                                        </IonRow>

                                        {/* Row Skeletons */}
                                        {[1, 2, 3, 4, 5, 6].map((item) => (
                                            <IonRow key={item} style={{ borderBottom: item < 6 ? "1px solid #ccc" : "none", padding: '12px 0' }}>
                                                <IonCol size="4"><IonSkeletonText animated style={{ width: '75%', height: '14px' }} /></IonCol>
                                                <IonCol size="4"><IonSkeletonText animated style={{ width: '60%', height: '14px' }} /></IonCol>
                                                <IonCol size="4"><IonSkeletonText animated style={{ width: '50%', height: '14px' }} /></IonCol>
                                            </IonRow>
                                        ))}
                                    </IonGrid>
                                </IonCardContent>
                            </IonCard>
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
                                //console.log("Opening Add User Modal");
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
                                    
                                    {filteredUsers.length === 0 ? (
                                        <IonRow>
                                            <IonCol style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                {searchQuery ? 'No matching users found' : 'No users found'}
                                            </IonCol>
                                        </IonRow>
                                    ) : (
                                    filteredUsers.map((user,index) => (
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
                                                
                                                </IonCol>
                                        </IonRow>

                                    ))
                                    )}
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