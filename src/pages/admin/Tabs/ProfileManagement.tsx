import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import { addOutline, cloudUploadOutline, documentAttach, text } from 'ionicons/icons';
import AddProfileModal from '../../../components/AddProfileModal';
import { useIonViewWillEnter } from '@ionic/react';


interface Profile {
    profileid: number;
    firstName: string;
    lastName: string;
    birthdate: string;
    age: number;
    contactnum: string;
    barangay: string;
    municipality: string;
    province: string;
    zipcode: string;
    TimeCreated?: string;
  
};
const ProfileManagement: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState < Profile | null > ();
    const [isEditing, setIsEditing] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    // Reset loading state 
    useIonViewWillEnter(() => {
        console.log("ProfileManagement view entered");
        setLoading(true);
        fetchProfiles(); 
        setHasFetched(true);
    });

    const fetchProfiles = async () => {
        try {
            const {data, error} = await supabase
                .from('profile')
                .select('*'); 

                if (error) {
                    setError(error.message);
                    setToastMessage('Error fetching profiles');
                    setShowToast(true);
                }
                if (data) {
                   // console.log("Fetched profiles:", data);
                    setProfiles(data);
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
                            Loading...
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
                                setShowAddModal(true);
                                setIsEditing(false);
                                setEditingProfile(null);
                            }}
                            style={{
                                '--background': '#002d54',
                                color: 'white',
                                borderRadius: '12px',
                            }}
                        >
                            <IonIcon icon={addOutline} slot="start" />
                            Register Profile
                        </IonButton>
                    </div>

                    {error && (
                        <div className="ion-margin-bottom ion-color-danger">
                            <IonText color="danger">{error}</IonText>
                        </div>
                    )}

                    <IonGrid>
                        <IonCard style={{ border: "1px solid #000",'--background':'#ffffffff' }}>
                            <IonCardContent>
                                <IonGrid>
                                    {/* Table Header */}
                                    <IonRow
                                        style={{
                                        borderBottom: "1px solid #000",
                                        fontWeight: "bold",
                                        color: "#000",
                                        }}
                                    >
                                        <IonCol>Name</IonCol>
                                        <IonCol>Date Registered</IonCol>
                                        <IonCol size="3">Action</IonCol>
                                    </IonRow>
                                        {/* Table Data */}
                                    {profiles.map((profile, index) => (
                                        <IonRow
                                        key={index}
                                        style={{
                                            borderBottom:
                                            index < profiles.length - 1
                                                ? "1px solid #ccc"
                                                : "none",
                                            color: "#000",
                                        }}
                                        className="ion-align-items-center"
                                        >
                                        <IonCol>
                                          {profile.firstName  || "No Name"} {profile.lastName || ""}
                                          <pre style={{ fontSize: '10px', color: 'gray' }}>
                                            ID: {profile.profileid}
                                          </pre>
                                        </IonCol>
                                        <IonCol>{profile.TimeCreated  || new Date().toLocaleDateString()}</IonCol>
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
                                            View
                                            </IonButton>
                                            <IonButton
                                            size="small"
                                            fill="outline"
                                            color="black"
                                            style={{ color: "#000", marginRight: "5px" }}
                                            >
                                            Edit
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

                <AddProfileModal 
                    isOpen = {showAddModal}
                    onClose = {() => setShowAddModal(false)}
                    onSave = {async (profileData) => {
                      console.log("Saved profile:", profileData);
                      await fetchProfiles();
                    }}
                />
            </IonContent>
        </IonPage>
    );
};

export default ProfileManagement;