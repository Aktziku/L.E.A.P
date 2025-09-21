import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonSpinner, IonText, IonTitle, IonToast, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../../../utils/supabaseClients';
import * as XLSX from 'xlsx';
import { addOutline, cloudUploadOutline, documentAttach, text } from 'ionicons/icons';
import AddProfileModal from '../../../components/AddProfileModal';
import { useIonViewWillEnter } from '@ionic/react';


interface Profile {
    profileid: number;
    fullname: string;
    age: number;
    birthdate: string;
    gender: string;
    email: string;
    contactnum: string;
    address: string;
    school: string;
    schoollevel: string;
}
const ProfileManagement: React.FC = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | undefined>();
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const [importing, setImporting] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);

    // Reset loading state and fetch profiles 
    useIonViewWillEnter(() => {
        setLoading(true); 
        setProfiles([]); 
        fetchProfiles();
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

    const handleAddProfile = async ( newProfile: Omit<Profile, 'profileid'>) => {
        try {
            // Check current user and their role
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('Not authenticated');
                setToastMessage('You must be logged in to add profiles');
                setShowToast(true);
                return;
            }

            // Check if user has admin role
            const { data: accountData, error: accountError } = await supabase
                .from('accounts')
                .select('role')
                .eq('auth_id', user.id)
                .single();

            if (accountError || !accountData) {
                setError('Could not verify admin privileges');
                setToastMessage('Could not verify admin privileges');
                setShowToast(true);
                return;
            }

            if (accountData.role !== 'admin') {
                setError('Unauthorized - Admin access required');
                setToastMessage('You must be an admin to add profiles');
                setShowToast(true);
                return;
            }

            const { data, error } = await supabase
                .from('profile')
                .insert([newProfile])
                .select();

            if (error) {
                setError(error.message);
                setToastMessage('Error adding profile');
                setShowToast(true);
                return;
            }
            if (data) {
                await fetchProfiles(); 
                setToastMessage('Profile added successfully');
                setShowToast(true);
            }
        } catch (error: any) {
            setError(error.message);
            setToastMessage('Error Adding Profile');
            setShowToast(true);
        }
    };

    const handleExcelImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setImporting(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            try{
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const excelData: any[] = XLSX.utils.sheet_to_json(sheet);

                for (const row of excelData) {
                    const Profile = {
                        fullname: String(row.fullname),
                        age: parseInt(row.age),
                        birthdate: String(row.birthdate),
                        gender: String(row.gender),
                        email: String(row.email),
                        contactnum: String(row.contactnum),
                        address: String(row.address),
                        school: String(row.school),
                        schoollevel: String(row.schoollevel),
                    };
                    await handleAddProfile(Profile);
                }
                setToastMessage('Profiles imported successfully');
                setShowToast(true);
            } catch (error) {
                setError('Error importing profiles');
                setToastMessage('Error importing profiles');
                setShowToast(true);
            } finally {
                setImporting(false);
            }
        };
                    reader.readAsBinaryString(file);
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
                        '--background': '#f8d9f0ff',
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
                                color: '#c48ace'
                            }}
                        />
                        <IonText
                            style={{
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: '#5a2d6d',
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
            <IonContent style={{ '--background': '#f8d9f0ff' }}>

                <div className="ion-padding">
                    <div className="ion-margin-bottom ion-margin-top">

                        {/*Button for adding profiles */}
                    <IonButton
                        className="ion-margin-end"
                        onClick={() => setShowAddModal(true)}
                        style={{
                            '--background': '#c48ace',
                            color: 'white',
                            borderRadius: '12px',
                        }}
                    >
                        <IonIcon icon={addOutline} slot="start" />
                        Add Profile
                    </IonButton>

                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        onChange={handleExcelImport}
                        style={{ display: 'none' }}
                        id="excel-upload"
                    />
                        {/* Button for Excel upload */}
                    <IonButton
                        className="ion-margin-end"
                        onClick={() => document.getElementById('excel-upload')?.click()}
                        disabled={importing}
                        style={{
                            '--background': '#f8adc6',
                            color: 'white',
                            borderRadius: '12px',
                        }}
                    >
                        <IonIcon icon={documentAttach} slot="start" />
                        {importing ? 'Importing...' : 'Import from Excel'}
                    </IonButton>
            </div>

                {error && (
                    <div className="ion-margin-bottom ion-color-danger">
                        <IonText color="danger">{error}</IonText>
                    </div>
                )}

            <IonGrid>
                <IonRow>
                    {profiles.map((profile) => (
                        <IonCol size ="12" sizeMd="6" key={profile.profileid}>

                            {/* Card to display each profile */}
                            <IonCard 
                                style={{
                                    borderRadius: '15px',
                                    boxShadow: '0 4px 12px rgba(196, 138, 206, 0.3)',
                                    background: '#ffffff',
                                }}
                            >
                                <IonHeader
                                    style={{
                                        padding: '10px 15px',
                                        background: '#fce9f4',
                                        borderTopLeftRadius: '15px',
                                        borderTopRightRadius: '15px',
                                    }}
                                >
                                    <h2 style={{ margin: '0', color: '#5a2d6d', fontSize: '1.2rem' }}>{profile.fullname} </h2>
                                </IonHeader>
                                <IonCardContent >
                                    <div className="profile-details">
                                        <p><strong>Age:</strong> {profile.age}</p>
                                        <p><strong>Birthdate:</strong> {profile.birthdate}</p>
                                        <p><strong>Gender:</strong> {profile.gender}</p>
                                        <p><strong>Email:</strong> {profile.email}</p>
                                        <p><strong>Contact Number:</strong> {profile.contactnum}</p>
                                        <p><strong>Address:</strong> {profile.address}</p>
                                        <p><strong>School:</strong> {profile.school}</p>
                                        <p><strong>School Level:</strong> {profile.schoollevel}</p>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    ))}
                </IonRow>
            </IonGrid>
        </div>

        <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={3000}
            position="bottom"
        />

        <AddProfileModal 
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddProfile}
        />
            </IonContent>
        </IonPage>
    );
};

export default ProfileManagement;