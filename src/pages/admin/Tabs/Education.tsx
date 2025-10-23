import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToast, IonToolbar, useIonViewWillEnter } from '@ionic/react';
import { addOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import AddEnrollRecordModal from '../../../components/AddEnrollRecordModal';

interface EducationProps {
   educationid: number;
   profileid: number;
   typeOfProgram: string;
   programCourse: string;
   status: string;
   institutionOrCenter: string;
   enroll_dropout_Date: string;
   elementary: string;
   juniorHigh: string;
   seniorHigh: string;
   college: string;
   firstName?: string;
   lastName?: string;
};




const Education: React.FC = () => {
    const [Education, setEducation] = useState<EducationProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEducation, setEditingEducation] = useState<EducationProps | null>(null);
    const [hasFetched, setHasFetched] = useState(false);

    useIonViewWillEnter(() => {
        console.log("ProfileManagement view entered");
        setLoading(true);
        fetchEducation(); 
        setHasFetched(true);
    });

    const fetchEducation = async () => {
        try {
            const {data, error} = await supabase
                .from('EducationAndTraining')
                .select(`
                    educationid,
                    profileid,
                    typeOfProgram,
                    programCourse,
                    status,
                    institutionOrCenter,
                    enroll_dropout_Date,
                    elementary,
                    juniorHigh,
                    seniorHigh,
                    college,
                    profile:profileid (firstName,lastName)
                    `);

            if (error) {
                setError(error.message);
                setToastMessage('Error fetching education data');
                setShowToast(true);
            }

            if (data) {
                setEducation(data);
                const formatted = data.map((item:any) => ({
                    ...item,
                    firstName: item.profile?.firstName || '',
                    lastName: item.profile?.lastName || '',
                }));
                setEducation(formatted);
            }

        } catch (error) {
            setError('An unexpected error occurred');
            setToastMessage('An unexpected error occurred');
            setShowToast(true);
        } finally {
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

                        {/*Button for adding Education Records */}
                        <IonButton
                            className="ion-margin-end"
                            onClick={() => {
                                setShowAddModal(true);
                                setIsEditing(false);
                                setEditingEducation(null);
                            }}
                            style={{
                                '--background': '#002d54',
                                color: 'white',
                                borderRadius: '12px',
                            }}
                        >
                            <IonIcon icon={addOutline} slot="start" />
                            Add Education Records
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
                                        <IonCol>Education/Training Type</IonCol>
                                        <IonCol>Program/Course</IonCol>
                                        <IonCol>Current Status</IonCol>
                                        <IonCol>Date Enrolled/Dropped</IonCol>
                                        <IonCol size='3'>Action</IonCol>
                                    </IonRow>

                                        {/* Table Data */}
                                    {Education.map((education, index) => (
                                        <IonRow
                                        key={index}
                                        style={{
                                            borderBottom:
                                            index < Education.length - 1
                                                ? "1px solid #ccc"
                                                : "none",
                                            color: "#000",
                                        }}
                                        className="ion-align-items-center"
                                        >
                                        <IonCol>
                                            {education.firstName  || "No Name"} {education.lastName || ""}
                                            <pre style={{ fontSize: '10px', color: 'gray' }}>
                                            ID: {education.profileid}
                                            </pre>
                                        </IonCol>
                                        <IonCol>{education.typeOfProgram || "No Program"}</IonCol>
                                        <IonCol>{education.programCourse || "No Course"}</IonCol>
                                        <IonCol>{education.status || "No Status"}</IonCol>
                                        <IonCol>{education.enroll_dropout_Date || "No Date"}</IonCol>
                                        <IonCol size="3" >
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

                <AddEnrollRecordModal
                    isOpen={showAddModal}
                    onClose={() => setShowAddModal(false)}
                    onSave={async (record: any) => {
                        await fetchEducation();
                        setShowAddModal(false);
                    }}
                />
            </IonContent>
        </IonPage>
    );
};

export default Education;