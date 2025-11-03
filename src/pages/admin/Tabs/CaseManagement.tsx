import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import React, { use } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import { addOutline } from 'ionicons/icons';
import AddCaseModal from '../../../components/AddCaseModal';

interface Case {
    caseid: number;
    profileid: number;
    case_type: string;
    case_status: string;
    case_created_by: string;
    assigned_worker: string;
    firstName?: string;
    lastName?: string;
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
                .select(`
                    caseid,
                    profileid,
                    case_type,
                    case_status,
                    case_created_by,
                    profile:profileid (
                        firstName,
                        lastName
                    )
                    `); 

                if (error) {
                    setError(error.message);
                    setToastMessage('Error fetching cases');
                    setShowToast(true);
                }
                if (data) {
                   // console.log("Fetched cases:", data);
                    const formatted = data.map((item:any) => ({
                    ...item,
                    firstName: item.profile?.firstName || '',
                    lastName: item.profile?.lastName || '',
                }));
                setCases(formatted);
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

                                        <IonCol size="3">Action</IonCol>
                                    </IonRow>

                                    {/* Table Rows */}
                                    {cases.map((caseItem) => (
                                        <IonRow key={caseItem.caseid} style={{ borderBottom: "1px solid #ccc", color: "#000" }}>
                                            <IonCol>
                                                {caseItem.firstName || "No Name"} {caseItem.lastName || ""}
                                            <pre style={{ fontSize: '10px', color: 'gray' }}>
                                            ID: {caseItem.profileid}
                                            </pre>
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
                                                    style={{ marginRight: "5px" }}
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
               
                <AddCaseModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={async (record:any) =>{
                        setToastMessage(isEditing ? 'Case updated successfully' : 'Case added successfully');
                        await fetchCases();
                        setShowAddModal(false);
                    }}
                />
            </IonContent>
        </IonPage>
    );
};

export default CaseManagement;