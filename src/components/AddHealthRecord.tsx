import { IonButton, IonCard, IonCardContent, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClients';

interface AddHealthRecordProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: any) => Promise<void>;
}

interface ProfileOption {
    profileid: number;
    firstName: string | null;
    lastName: string | null;
}

interface formState {
    profileid: number | null;
    profileSearch: string;
    pregnancy_status: string;
    stage_of_pregnancy: string;
    medical_history: string[];
    medical_history_others: string;
    types_of_support: string[];
    num_of_pregnancies: number;
    tentanus_vacc: boolean;
    tetanus_dose: number;
    date_of_last_mens_period: string;
    height: number;
    weight: number;
    temperature: number;
}

const emptyForm: formState = {
    profileid: null,
    profileSearch: '',
    pregnancy_status: '',
    stage_of_pregnancy: '',
    medical_history: [],
    medical_history_others: '',
    types_of_support: [],
    num_of_pregnancies: 0,
    tentanus_vacc: false,
    tetanus_dose: 0,
    date_of_last_mens_period: '',
    height: 0,
    weight: 0,
    temperature: 0,
};

const AddHealthRecord: React.FC<AddHealthRecordProps> = ({ isOpen, onClose, onSave}) => {
    const [profiles, setProfiles] = useState<ProfileOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [save, setSave] = useState(false);
    const [prefillLoading, setPrefillLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<formState>(emptyForm);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredProfiles, setFilteredProfiles] = useState<ProfileOption[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
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
            profileid: null,
        }));

        if (searchValue.trim() === '') {
            setFilteredProfiles([]);
            setShowSuggestions(false);
            return;
        }

        const filtered = profiles.filter((profile) => {
            const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.toLowerCase();
            return fullName.includes(searchValue.toLowerCase());
        });

        setFilteredProfiles(filtered);
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
                    setProfiles(data ?? []);
                }
                setLoading(false);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
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

    const handleChange = <K extends keyof formState>(key: K, value: formState[K]) => {
        setForm((prevForm) => ({
            ...prevForm,
            [key]: value,
        }));
    };

    const handleCheckbox = (field: 'medical_history' | 'types_of_support', value: string, checked: boolean) => {
        setForm((prev) => {
            const current = prev[field] || [];
            const updated = checked
                ? [...current, value]
                : current.filter((item) => item !== value);
            return { ...prev, [field]: updated };
        });
    };

    const handleSave = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!form.profileid) {
            setError('Please select a profile.');
            return;
        }
        setSave(true);
        setError(null);

        const currentYear = new Date().getFullYear();
        const yearPrefix = currentYear.toString();
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const newHealthId = parseInt(`${yearPrefix}${randomSuffix}`);

        const medicalHistoryString = [
            ...form.medical_history,
            ...(form.medical_history_others ? [`Others: ${form.medical_history_others}`] : [])
        ].join(',');

        const payload ={
            health_id: newHealthId,
            profileid: form.profileid,
            pregnancy_status: form.pregnancy_status || null,
            stage_of_pregnancy: form.stage_of_pregnancy || null,
            medical_history: medicalHistoryString || null,
            types_of_support: form.types_of_support.join(',') || null,
            num_of_pregnancies: form.num_of_pregnancies || 0,
            tentanus_vacc: form.tentanus_vacc,
            tetanus_dose: form.tetanus_dose || 0,
            date_of_last_mens_period: form.date_of_last_mens_period || null,
            height: form.height || 0,
            weight: form.weight || 0,
            temperature: form.temperature || 0,
        };
        
        const { error } = await supabase
            .from('maternalHealthRecord')
            .insert([payload]);

            if (error) {
                if (error.code === '23505') {
                    setError('A health record for this profile already exists.');
                } else {
                    setError(error.message);
                }
            } else {
                await onSave(payload);
                setForm(emptyForm);
            } 
            setSave(false);
    };

    const showEmptyProfilesMessage = useMemo(
    () => !loadProfiles && profiles.length === 0,
    [loadProfiles, profiles.length]
    );

    const medicalConditions = [
        "Tuberculosis (14 days or more of cough)",
        "Heart Diseases",
        "Diabetes",
        "Hypertension",
        "Bronchial Asthma",
        "Urinary Tract Infection",
        "Parasitism",
        "Goiter",
        "Anemia",
        "Malnutrition",
        "Genital Tract Infection"
    ];

    const supportTypes = ["Financial Aid", "Counseling", "Health Support", "Livelihood Training"];

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
                        {isEditing ? 'Edit Health Record' : 'Add Health Record'}
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
                                        disabled={save || showEmptyProfilesMessage || prefillLoading}
                                        style={{ '--color': '#000000' }}
                                    />
                                    {prefillLoading && (
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
                                        {filteredProfiles.map((profile) => (
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

                            </IonList>
                        </IonCardContent>
                    </IonCard>
                )}
            </IonContent>
        </IonModal>
    );
};

export default AddHealthRecord;