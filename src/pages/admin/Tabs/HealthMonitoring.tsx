import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonModal, IonPage, IonRow, IonSearchbar, IonSpinner, IonText, IonTitle, IonToast, IonToolbar, useIonRouter, useIonViewWillEnter } from '@ionic/react';
import { addOutline, logoIonic, searchOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import AddHealthRecord from '../../../components/AddHealthRecord';

interface HealthMonitoring {
    health_id: number;
    profileid: number;
    medical_history: string;
    pregnancy_status: string;
    types_of_support: string;
    stage_of_pregnancy: string;
    num_of_pregnancies: number;
    tentanus_vacc: boolean;
    tetanus_dose: number;
    date_of_last_mens_period: string;
    height: number;
    weight: number;
    temperature: number;
    firstName?: string;
    lastName?: string;
};

const HealthMonitoring: React.FC = () => {
    const [health, setHealth] = useState<HealthMonitoring[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingHealth, setEditingHealth] = useState<HealthMonitoring | null>();
    const [isEditing, setIsEditing] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

     // Reset loading state 
    useIonViewWillEnter(() => {
        console.log("HealthMonitoring view entered");
        setLoading(true);
        fetchHealthData();
        setHasFetched(true);
    });

    const fetchHealthData = async () => {
        try {
            const {data, error} =await supabase 
            .from('maternalhealthRecord')
            .select(`
                health_id,
                profileid,
                medical_history,
                pregnancy_status,
                types_of_support,
                stage_of_pregnancy,
                num_of_pregnancies,
                tentanus_vacc,
                tetanus_dose,
                date_of_last_mens_period,
                height,
                weight,
                temperature,
                profile:profileid (
                    firstName,
                    lastName
                )
            `);
        
            if (error) {
                setError('Error fetching health data');
                setShowToast(true);
                setToastMessage('Error fetching health data');
            }

            if (data) {
                const formattedData = data.map((item: any) => ({
                    ...item,
                    firstName: item.profile?.firstName || '',
                    lastName: item.profile?.lastName || '',
                }));
                setHealth(formattedData);
            }
        } catch (error) {
            console.error('Error fetching health data:', error);
            setError('Error fetching health data');
            setShowToast(true);
            setToastMessage('Error fetching health data');
        } finally {
            setLoading(false);
        }
    };


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
                <div className='ion-padding'>
                    <div className='ion-margin-bottom ion-margin-top'>
                        <IonButton
                            className="ion-margin-end"
                            onClick={() => {
                                setShowAddModal(true);
                                setIsEditing(false);
                                setEditingHealth(null);
                            }}
                            style={{
                                '--background': '#002d54',
                                color: 'white',
                                borderRadius: '12px',
                            }}
                        >
                            <IonIcon icon={addOutline} />
                            Add Health Record
                        </IonButton>
                    </div>

                    {error && (
                        <div className="ion-margin-bottom ion-color-danger">
                            <IonText color="danger">{error}</IonText>
                        </div>
                    )}

                    <IonGrid>
                        <IonCard style={{ border: "1px solid #000", '--background': '#ffffffff' }}>
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
                                        <IonCol>Pregnancy Status</IonCol>
                                        <IonCol>Stage</IonCol>
                                        <IonCol>Medical History</IonCol>
                                        <IonCol size="3">Action</IonCol>
                                    </IonRow>

                                    {/* Table Rows */}
                                    {health.length === 0 ? (
                                        <IonRow>
                                            <IonCol style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                                No health records found
                                            </IonCol>
                                        </IonRow>
                                    ) : (
                                        health.map((healthRecord) => (
                                            <IonRow key={healthRecord.health_id} style={{ borderBottom: "1px solid #ccc", color: "#000" }}>
                                                <IonCol>
                                                    {healthRecord.firstName || "No Name"} {healthRecord.lastName || ""}
                                                    <pre style={{ fontSize: '10px', color: 'gray' }}>
                                                        ID: {healthRecord.profileid}
                                                    </pre>
                                                </IonCol>
                                                <IonCol>{healthRecord.pregnancy_status || 'N/A'}</IonCol>
                                                <IonCol>{healthRecord.stage_of_pregnancy || 'N/A'}</IonCol>
                                                <IonCol>
                                                    <div style={{ 
                                                        maxWidth: '200px', 
                                                        overflow: 'hidden', 
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}>
                                                        {healthRecord.medical_history || 'None'}
                                                    </div>
                                                </IonCol>
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
                                                        fill="outline"
                                                        size="small"
                                                        onClick={() => {
                                                            setIsEditing(true);
                                                            setEditingHealth(healthRecord);
                                                            setShowAddModal(true);
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

                <AddHealthRecord 
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={async (record:any ) => {
                        await fetchHealthData();
                        setShowAddModal(false);
                    }}
                />
            </IonContent>
        </IonPage>
    );
};

export default HealthMonitoring;