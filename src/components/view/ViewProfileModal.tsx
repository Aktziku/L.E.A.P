import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonModal, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { use, useEffect, useState } from 'react';
import { supabase } from '../../utils/supabaseClients';

interface ViewProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profileId: number | null;
}
const ViewProfileModal: React.FC<ViewProfileModalProps> = ({ isOpen, onClose, profileId }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [profileData, setProfileData] = useState<any>(null);
    const [partnerData, setPartnerData] = useState<any>(null);
    const [healthData, setHealthData] = useState<any>(null);

    useEffect(() => {
        if (isOpen && profileId) {
            fetchProfileData();
        }
    }, [isOpen,profileId]);

    const fetchProfileData = async () => {
        if (!profileId) return;
        setLoading(true);
        setError(null);

        try {
            const {data: profile, error: profileError} = await supabase
                .from('profile')
                .select('*')
                .eq('profileid', profileId)
                .single();

            if (profileError) {
                setError(profileError.message);
            }

            const {data: partner, error: partnerError} = await supabase
                .from('partnersInfo')
                .select('*')
                .eq('profileid', profileId)
                .maybeSingle();

            const {data: health, error: healthError} = await supabase
                .from('maternalhealthRecord')
                .select('*')
                .eq('profileid', profileId)
                .maybeSingle();

            setProfileData(profile);
            setPartnerData(partner);
            setHealthData(health);
        } catch (error: any) {
            console.error('Error fetching profile data', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const formatMedicalHistory = (medicalHistory: string) => {
        if (!medicalHistory) return 'N/A';
        return medicalHistory.split(',').map(item => item.trim()).join(', ');
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} style={{'--width':'100%','--height':'100%',}}>
            <IonHeader>
                <IonToolbar
                    style={{
                        '--background': '#002d54',
                        color: '#fff',
                    }}
                >
                    <IonTitle style={{ fontWeight: 'bold' }}>
                        View Profile
                    </IonTitle>

                    <IonButton
                        slot="end"
                        onClick={onClose}
                        style={{
                            '--background': '#fff',
                            '--color': '#000000ff',
                            borderRadius: '8px',
                            marginRight: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Close
                    </IonButton>
                </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding" style={{ "--background": "#fff" }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <IonSpinner />
                    </div>
                ) : error ? (
                    <IonText color="danger">
                        <p>{error}</p>
                    </IonText>
                ) : profileData ? (
                    <IonCard style={{borderRadius: "15px", boxShadow: "0 0 10px #ccc", "--background": "#fff"}}>
                        <IonCardContent>
                            <h2 style={{ color: "black", fontWeight: "bold", backgroundColor: '#fff', padding: '10px', fontSize: '1.5rem', borderBottom: '2px solid #002d54' }}>
                                    Profile Deatails
                                </h2>

                            {/* Profile Information */}
                            <IonItemGroup>
                                <IonItemDivider style={{'--color':'#000',fontWeight:'bold','--background':'#fff'}}>
                                    Teenage Basic Information
                                </IonItemDivider>
                                {/* FirstName*/}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Profile ID:</strong> {profileData.profileid}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* LastName*/}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>First Name:</strong> {profileData.firstName}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Last Name:</strong> {profileData.lastName}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Age and Date of Birth*/}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Age:</strong> {profileData.age || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Date of Birth:</strong> {profileData.birthdate || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Contact Number and Marital Status*/}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Contact Number</strong> {profileData.contactnum || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Marital Status:</strong> {profileData.marital_status || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Religion and Living With */}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Religion:</strong> {profileData.religion || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Living With</strong> {profileData.living_with || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Indigenous People */}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Indigenous Ethnicity:</strong> {profileData.indigenous_ethnicity || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Fathers and Mothers Occupation */}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Fathers Occupation:</strong> {profileData.fathers_occupation || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Mothers Occupation:</strong> {profileData.mothers_occupation || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                                {/* Family Income*/}
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size="12" size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonLabel>
                                                    <strong>Family Income:</strong> {profileData.family_income || 'N/A'}
                                                </IonLabel>
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                            </IonItemGroup>

                            {/* Partner Information */}
                    {partnerData && (
                     <IonItemGroup>
                        <IonItemDivider style={{'--color':'#000',fontWeight:'bold','--background':'#fff'}}>
                            Partner Information
                        </IonItemDivider>
                        {/*Partner's Name*/}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>First Name:</strong> {partnerData.pFirstname || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Last Name:</strong> {partnerData.pLastname || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        {/* Parthners Birthday */}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Birthday:</strong> {partnerData.pBirthday || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        {/* Partners Occupation */}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Occupation:</strong> {partnerData.pOccupation || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Income:</strong> {partnerData.pIncome || 'N/A'}
                                        </IonLabel> 
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                    </IonItemGroup>
                    )}

                    {/*Adress Information */}
                    <IonItemGroup>
                        <IonItemDivider style={{'--color':'#000',fontWeight:'bold','--background':'#fff'}}>
                            Address Information
                        </IonItemDivider>
                        {/*Region and Province*/}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Region:</strong> {profileData.region || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Province:</strong> {profileData.province || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        {/*City/Municipality and Barangay*/}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>City/Municipality:</strong> {profileData.municipality || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Barangay:</strong> {profileData.barangay || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                        {/*zipcode*/}
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" size-md='6'>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Zipcode:</strong> {profileData.zipcode || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItemGroup>
                    
                    {/* EDUCATIONAL BACKGROUND */}
                    <IonItemGroup>
                        <IonItemDivider
                            style={{
                                "--color": "#000",
                                fontWeight: "bold",
                                "--background": "#fff",
                            }}
                        >
                            Educational Background
                        </IonItemDivider>
                        <IonGrid>
                            <IonRow>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Current Year Level:</strong> {profileData.current_year_level || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                                <IonCol size="12" sizeMd="6">
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonLabel>
                                            <strong>Highest Educational Attainment:</strong> {profileData.highest_educational_attainment || 'N/A'}
                                        </IonLabel>
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonItemGroup>

                    {/* HEALTH STATUS */}
                    {healthData && (
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Health Status
                            </IonItemDivider>
                            {/* Pregnancy */}
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="12" sizeMd="6">
                                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                                            <IonLabel>
                                                <strong>Pregnancy Status:</strong> {healthData.pregnancy_status || 'N/A'}
                                            </IonLabel>
                                        </IonItem>
                                    </IonCol>
                                    <IonCol size="12" sizeMd="6">
                                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                                            <IonLabel>
                                                <strong>Stage of Pregnancy:</strong> {healthData.stage_of_pregnancy || 'N/A'}
                                            </IonLabel>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                            {/* Medical History */}
                            <IonGrid>
                                <IonRow>
                                    <IonCol size="12" sizeMd="6">
                                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                                            <IonLabel>
                                                <strong>Medical History:</strong> {healthData.medical_history || 'N/A'}
                                            </IonLabel>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItemGroup>
                    )}
                    </IonCardContent>
                    </IonCard>
                ) : null }

            </IonContent>
        </IonModal>
    );
};

export default ViewProfileModal;