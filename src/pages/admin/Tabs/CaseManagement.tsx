import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { use } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import { addOutline } from 'ionicons/icons';

interface Case {
    caseid: number;
    profileid: number;
    case_type: string;
    case_status: string;
    status: string;
    councilor: string;
    barangay_health_worker: string;
    social_worker: string;
    last_follow_up: string;
    case_created_by: string;
};
const CaseManagement: React.FC = () => {
    const [cases, setCases] = React.useState<Case[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | undefined>();
    const [toastMessage, setToastMessage] = React.useState('');
    const [showToast, setShowToast] = React.useState(false);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [editingCase, setEditingCase] = React.useState<Case | null>();
    const [isEditing, setIsEditing] = React.useState(false);
    const [hasFetched, setHasFetched] = React.useState(false);

    useIonViewWillEnter(() => {
        console.log("CaseManagement view entered");
        setLoading(true);
        fetchCases(); 
        setHasFetched(true);
    });

    const fetchCases = async () => {
        try {
            const {data, error} = await supabase
                .from('caseManagement')
                .select('*'); 

                if (error) {
                    setError(error.message);
                    setToastMessage('Error fetching cases');
                    setShowToast(true);
                }
                if (data) {
                   // console.log("Fetched cases:", data);
                    setCases(data);
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
               <div className='ion-padding'>
                    <div className='ion-margin-bottom ion-margin-top' >
                        <IonButton
                            className="ion-margin-end"
                            onClick={() => {
                                setShowAddModal(true);
                                setIsEditing(false);
                                //setEditingProfile(null);
                            }}
                            style={{
                                '--background': '#002d54',
                                color: 'white',
                                borderRadius: '12px',
                            }}
                        >
                            <IonIcon icon={addOutline} />
                            Add Case
                        </IonButton>
                    </div>

                    {error && (
                        <div className="ion-margin-bottom ion-color-danger">
                            <IonText color="danger">{error}</IonText>
                        </div>
                    )}

                    <IonGrid>
                        <IonCard  style={{ border: "1px solid #000",'--background':'#ffffffff' }}>
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
                                        <IonCol>Assigned Worker</IonCol>
                                        <IonCol>Status</IonCol>
                                        <IonCol>Last Follow-Up</IonCol>
                                        <IonCol size="3">Action</IonCol>
                                    </IonRow>

                                    {/* Table Rows */}
                                    {cases.map((caseItem) => (
                                        <IonRow key={caseItem.caseid} style={{ borderBottom: "1px solid #ccc", color: "#000" }}>
                                            <IonCol>{caseItem.case_type}</IonCol>
                                            <IonCol>{caseItem.barangay_health_worker}</IonCol>
                                            <IonCol>{caseItem.status}</IonCol>
                                            <IonCol>{caseItem.last_follow_up}</IonCol>
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
                                                        setEditingCase(caseItem);
                                                        setShowAddModal(true);
                                                    }}
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
            </IonContent>
        </IonPage>
    );
};

export default CaseManagement;