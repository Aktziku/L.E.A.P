import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRadio, IonRadioGroup, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { filter, save } from 'ionicons/icons';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClients';
import CaseManagement from '../pages/admin/Tabs/CaseManagement';

interface AddCaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (caseData: any) => Promise<void>;
}

interface ProfileOption {
    profileid: number;
    firstName: string | null;
    lastName: string | null;
}

interface FormState {
    profileid: number | null;
    profileSearch: string;
    case_type: string;
    case_status: string;
    case_created_by: string;
    frequent: string;

}

const emptyForm: FormState= {
    profileid: null,
    profileSearch: '',
    case_type: '',
    case_status: '',
    case_created_by: '',
    frequent: '',
}
const AddCaseModal: React.FC<AddCaseModalProps> = ({ isOpen, onClose, onSave }) => {

        const [isEditing, setIsEditing] = useState(false);
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [form, setForm] = useState<FormState>(emptyForm);
        const [saved, setSaved] = useState(false);
        const [profile, setProfile] = useState<ProfileOption[]>([]);
        const [profileLoading, setProfileLoading] = useState(false);
        const [filterProfile, setFilterProfile] = useState<ProfileOption[]>([]);
        const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() =>{
            if (!isOpen) {
                return;
            }
            setForm(emptyForm);
            setError(null);
            void loadProfiles();
        }, [isOpen]);
        const handleProfileSearch = (searchValue: string) => {
            setForm((prevForm) => ({
                ...prevForm,
                profileSearch: searchValue,
                profileid: null
            }));

            if (searchValue.trim() === '') {
                setFilterProfile([]);
                setShowSuggestions(false);
                return;
            }

            const filtered = profile.filter((profile) => {
                const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.toLowerCase();
                return fullName.includes(searchValue.toLowerCase());
            });
            setFilterProfile(filtered);
            setShowSuggestions(true);
        };

        const loadProfiles = async () => {
            setLoading(true);
            try {
                const {data,error} = await supabase
                    .from('profile')
                    .select('profileid,firstName,lastName')
                    .order('lastName',{ascending:true});
    
                    if (error) {
                        setError(error.message);
                    } else {
                        setProfile(data ?? []);
                    }
                    setLoading(false);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unexpected error occurred');
                }
            }
        };

        const handleProfileSelect = async (profile: ProfileOption) => {
        
        setError(null);

        setForm((prevForm) => ({
            ...prevForm,
            profileid: profile.profileid,
            profileSearch: `${profile.lastName ?? ''}, ${profile.firstName ?? ''} (ID: ${profile.profileid})`,
        }));
        setShowSuggestions(false);
            
    };

    const handleChange = <K extends keyof FormState>(key: K, value: FormState[K]) => {
        setForm((prevForm) => ({
            ...prevForm,
            [key]: value,
        }));
    };

    const handleSave = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!form.profileid) {
            setError('Please select a profile.');
            return;
        }
        setSaved(true);
        setError(null);

        const currentYear = new Date().getFullYear();
        const yearPrefix = parseInt( currentYear.toString());

        const randomSuffix = Math.floor(1000 + Math.random() * 9000); 
        const newCaseId = parseInt(`${yearPrefix}${randomSuffix}`);

        const payLoad = {
            caseid: newCaseId,
            profileid: form.profileid,
            case_type: form.case_type || null,
            case_status: form.case_status || null,
            case_created_by: form.case_created_by || null,
            frequent: form.frequent || null,
        };

        const { error } = await supabase
            .from('caseManagement')
            .insert(payLoad);

        if (error) {

            if (error.code === '23505') {
                setError('A case with this ID already exists. Please try again.');
            } else {
                setError(error.message);
            }
        } else {
            await onSave(payLoad);
            setForm(emptyForm);
            onClose();
        }
        setSaved(false);
    };

    const showEmptyProfilesMessage = useMemo(
            () => !loading && profile.length === 0,
            [loading, profile.length],
        );

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} style={{'--width':'100%','--height':'100%',}}>
            <IonHeader>
                <IonToolbar
                    style={{
                        '--background': '#002d54',
                        color: '#fff',
                    }}
                >
                    <IonTitle
                        style={{
                            fontWeight: 'bold',
                        }}
                    >
                        {isEditing ? 'Edit Education Record' : 'Add Education Record'}
                    </IonTitle>

                    {/* Close button */}
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
            <IonContent style={{ '--background': '#ffffffff' }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                        <IonSpinner />
                    </div>
                ) : (
                    <IonCard style={{ borderRadius: "15px", boxShadow: "0 0 10px #ccc", "--background": "#fff" }}>
                        <IonCardContent style={{"--background": "#fff",}}>
                            <IonList style={{ "--background": "#fff",}}>

                                {error && (
                                <IonText color="danger" style={{ display: "block", marginBottom: "1rem" }}>
                                    {error}
                                </IonText>
                                )}

                                {/* Profile Selector */}
                                <IonItem style={{ "--background": "#fff", "--color": "#000000", '--background-hover':'#fff', '--background-focused':'transparent','--background-activated':'#fff', position: 'relative' }}>
                                    <IonLabel position="stacked" style={{ '--color': '#000000' }}>
                                        Name <IonText color="danger">*</IonText>
                                    </IonLabel>
                                    <IonInput
                                        placeholder="Search by name..."
                                        value={form.profileSearch}
                                        onIonInput={(event) => handleProfileSearch(event.detail.value ?? '')}
                                        disabled={saved || showEmptyProfilesMessage || profileLoading}
                                        style={{ '--color': '#000000' }}
                                    />
                                    {profileLoading && (
                                        <IonSpinner slot="end" name="dots" style={{ transform: 'translateY(6px)' }} />
                                    )}
                                </IonItem>

                                {/* Suggestions Dropdown */}
                                {showSuggestions && (
                                    <div style={{
                                        position: 'relative',
                                        zIndex: 1000,
                                        backgroundColor: '#fff',
                                        border: '1px solid #ccc',
                                        borderRadius: '2px',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        marginTop: '-10px',
                                        
                                        
                                    }}>
                                        {filterProfile.map((profile) => (
                                            <div
                                                key={profile.profileid}
                                                onClick={() => handleProfileSelect(profile)}
                                                style={{
                                                    padding: '12px 16px',
                                                    cursor: 'pointer',
                                                    borderBottom: '1px solid #eee',
                                                    color: '#000'
                                                }}
                                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
                                            >
                                                {profile.lastName ?? 'Unknown'}, {profile.firstName ?? 'Unknown'} (ID: {profile.profileid})
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <IonItem  style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                                    <IonLabel position="stacked" style={{ '--color': '#000000' }}>
                                        Type of Service/Support Received
                                    </IonLabel>
                                    <IonRadioGroup>
                                        <IonItem className='ion-margin-top' lines="none" style={{ "--background": "#fff", "--color": "#000" }}>
                                            <IonRadio value='Yes'>Yes</IonRadio>
                                        </IonItem>
                                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000" }}>
                                            <IonRadio value='No'>No</IonRadio>
                                        </IonItem>
                                    </IonRadioGroup>
                                </IonItem>

                                {/* Type of Program */}
                                <IonItem  style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent', }}>
                                    <IonLabel position="stacked" style={{ '--color': '#000000' }}>
                                        Type of Service/Support Received
                                    </IonLabel>
                                    <IonInput
                                        type="text"
                                        value={form.case_type}
                                        onIonChange={(event) => handleChange("case_type", event.detail.value ?? '')}
                                        style={{ '--color': '#000000' }}
                                    />
                                </IonItem>

                                 {/* Status */}
                                <IonItem style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent' }}>
                                    <IonLabel position="stacked" style={{ '--color': '#000000' }}>How Frequent?</IonLabel>
                                    <IonSelect
                                        className='ion-margin'
                                        placeholder='Select Frequency'
                                        value={form.frequent}
                                        style={{ "--color": "#000" }}
                                        onIonChange={(e) => handleChange("frequent", e.detail.value)}
                                        disabled={saved}
                                    >
                                        <IonSelectOption value="Weekly">Weekly</IonSelectOption>
                                        <IonSelectOption value="Monthly">Monthly</IonSelectOption>
                                        <IonSelectOption value="Quarterly">Quarterly</IonSelectOption>
                                        <IonSelectOption value="Annually">Annually</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </IonList>

                        <IonRow className="ion-justify-content-center ion-margin-top" style={{ '--background': 'transparent' }}>
                            <IonCol size="auto">
                                <IonButton
                                    expand="block"
                                    onClick={handleSave}
                                    style={{ '--background': '#002d54', color: '#fff' }}
                                    disabled={saved || loading || showEmptyProfilesMessage || profileLoading}
                                >
                                    {saved ? <IonSpinner name="lines-small" /> : 'Save'}
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonModal>
    );
};

export default AddCaseModal;