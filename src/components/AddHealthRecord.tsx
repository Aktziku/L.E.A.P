import { IonButton, IonCard, IonCardContent, IonCheckbox, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonItemDivider, IonItemGroup, IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
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
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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
        setShowSuggestions(false);
        setFilteredProfiles([]);
        setPrefillLoading(true);

        try {
        const {data,error} = await supabase
            .from('maternalhealthRecord')
            .select('*')
            .eq('profileid', profile.profileid)

            //console.log('=== QUERY RESULT ===');
            //console.log('All matching records:', data);
            //console.log('Error:', error);
           // console.log('Number of records found:', data?.length);

            if (error) {
                console.error('Database error:', error);
                setError(error.message);
                setPrefillLoading(false);
                return;
            } 
            if (data && data.length > 0) {

                 const latestRecord = data.reduce((prev, current) => 
                (current.health_id > prev.health_id) ? current : prev
            );
                console.log('Latest record:', latestRecord);
                const medicalHistoryArray = latestRecord.medical_history 
                ? latestRecord.medical_history.split(',').map((item: string) => item.trim()) 
                : [];
            const typesOfSupportArray = latestRecord.types_of_support 
                ? latestRecord.types_of_support.split(',').map((item: string) => item.trim()) 
                : [];

                setForm({
                profileid: profile.profileid,
                profileSearch: `${profile.lastName ?? ''}, ${profile.firstName ?? ''} (ID: ${profile.profileid})`,
                pregnancy_status: latestRecord.pregnancy_status || '',
                stage_of_pregnancy: latestRecord.stage_of_pregnancy || '',
                medical_history: medicalHistoryArray,
                types_of_support: typesOfSupportArray,
                num_of_pregnancies: latestRecord.num_of_pregnancies || 0,
                tentanus_vacc: latestRecord.tentanus_vacc || false,
                tetanus_dose: latestRecord.tetanus_dose || 0,
                date_of_last_mens_period: latestRecord.date_of_last_mens_period || '',
                height: latestRecord.height || 0,
                weight: latestRecord.weight || 0,
                temperature: latestRecord.temperature || 0,
            });
                //console.log(' Form updated with data!');

            } else {
                //console.log('No existing health record found for this profile');
                setForm ({
                    ...emptyForm,
                    profileid: profile.profileid,
                    profileSearch: `${profile.lastName ?? ''}, ${profile.firstName ?? ''} (ID: ${profile.profileid})`,
                });
            }
        } catch (error) {
            //console.error('Error fetching health record:', error);
            setError('An unexpected error occurred while fetching health record.');
        } finally {

            setPrefillLoading(false);
        }
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
            .from('maternalhealthRecord')
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

    const supportTypes = ["Family Support", "Counseling",];

    const responsiveRow: React.CSSProperties = {
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '10px' : '20px',
        width: '100%',
    };

    const responsiveCol: React.CSSProperties = {
        flex: 1,
        minWidth: isMobile ? '100%' : '48%',
    };
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

            <IonContent className="ion-padding" style={{ "--background": "#fff", display:'flex', justifyContent:'center', alignItems:'center', padding:'20px' }}>
                <IonCard style={{ borderRadius: "15px", boxShadow: "0 0 10px #ccc", "--background": "#fff",width: isMobile ? '100%' : '90%', margin:'auto' }}>
                    <IonCardContent>
                        <h2 style={{ color: "black", fontWeight: "bold", backgroundColor: '#fff', padding: '10px', fontSize: isMobile ? '1.3rem' : '2rem', textAlign: 'center', }}>
                            Health Record Form
                        </h2>

                        {/* PROFILE SELECTION */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Profile Selection
                            </IonItemDivider>

                            <IonRow>
                                <IonCol>
                                    <IonItem lines="none" style={{ "--background": "#fff", position: 'relative' }}>
                                        <IonInput
                                            className='ion-margin'
                                            label="Search Profile Name"
                                            labelPlacement="floating"
                                            fill="outline"
                                            placeholder="Type name to search..."
                                            value={form.profileSearch}
                                            onIonInput={(event) => handleProfileSearch(event.detail.value ?? '')}
                                            disabled={save || showEmptyProfilesMessage || prefillLoading}
                                            style={{ "--color": "#000" }}
                                        />
                                        {prefillLoading && (
                                            <IonSpinner slot="end" name="dots" style={{ marginRight: '10px' }} />
                                        )}
                                    </IonItem>
                                    
                                    {/* Suggestions Dropdown */}
                                    {showSuggestions && (
                                        <div style={{
                                            position: 'relative',
                                            zIndex: 1000,
                                            backgroundColor: '#fff',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            maxHeight: '200px',
                                            overflowY: 'auto',
                                            marginLeft: '16px',
                                            marginRight: '16px',
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
                                </IonCol>
                            </IonRow>
                        </IonItemGroup>

                        {/* PREGNANCY INFORMATION */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                    marginTop: "10px",
                                }}
                            >
                                Pregnancy Information
                            </IonItemDivider>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size='12' size-md='6'>
                                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent' }}>
                                            <IonSelect
                                                className='ion-margin'
                                                label="Pregnancy Status"
                                                labelPlacement="floating"
                                                fill="outline"
                                                value={form.pregnancy_status}
                                                onIonChange={(e) => handleChange('pregnancy_status', e.detail.value)}
                                                style={{ "--color": "#000" }}
                                                disabled={save || prefillLoading}
                                            >
                                                <IonSelectOption value="Pregnant">Pregnant</IonSelectOption>
                                                <IonSelectOption value="Not Pregnant">Not Pregnant</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size='12' size-md='6'>
                                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000", '--background-hover':'transparent' }}>
                                            <IonSelect
                                                className='ion-margin'
                                                label="Stage of Pregnancy"
                                                labelPlacement="floating"
                                                fill="outline"
                                                value={form.stage_of_pregnancy}
                                                onIonChange={(e) => handleChange('stage_of_pregnancy', e.detail.value)}
                                                style={{ "--color": "#000" }}
                                                disabled={save || prefillLoading}
                                            >
                                                <IonSelectOption value="First Trimester (1-12 weeks)">First Trimester (1-12 weeks)</IonSelectOption>
                                                <IonSelectOption value="Second Trimester (13-26 weeks)">Second Trimester (13-26 weeks)</IonSelectOption>
                                                <IonSelectOption value="Third Trimester (27-40 weeks)">Third Trimester (27-40 weeks)</IonSelectOption>
                                                <IonSelectOption value="N/A">N/A</IonSelectOption>
                                            </IonSelect>
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                            <IonGrid>
                                <IonRow>
                                    <IonCol size='12' size-md='6'>
                                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                                            <IonInput
                                                className='ion-margin'
                                                label="Number of Pregnancies"
                                                labelPlacement="floating"
                                                fill="outline"
                                                type="number"
                                                value={form.num_of_pregnancies}
                                                onIonInput={(e) => handleChange('num_of_pregnancies', parseInt(e.detail.value ?? '0'))}
                                                style={{ "--color": "#000" }}
                                                disabled={save || prefillLoading}
                                            />
                                        </IonItem>
                                    </IonCol>

                                    <IonCol size='12' size-md='6'>
                                        <IonItem lines="none" style={{ "--background": "#fff" }}>
                                            <IonInput
                                                className='ion-margin'
                                                label="Date of Last Menstrual Period"
                                                labelPlacement="floating"
                                                fill="outline"
                                                type="date"
                                                value={form.date_of_last_mens_period}
                                                onIonInput={(e) => handleChange('date_of_last_mens_period', e.detail.value ?? '')}
                                                style={{ "--color": "#000" }}
                                                disabled={save || prefillLoading}
                                            />
                                        </IonItem>
                                    </IonCol>
                                </IonRow>
                            </IonGrid>
                        </IonItemGroup>

                        {/* MEDICAL HISTORY */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Medical History
                            </IonItemDivider>

                            <IonGrid>
                                <IonRow>
                                    {medicalConditions.map((condition) => (
                                        <IonCol size='12' size-md='6' key={condition}>
                                            <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000" }}>
                                                <IonCheckbox
                                                    checked={form.medical_history.includes(condition)}
                                                    onIonChange={(e) => handleCheckbox('medical_history', condition, e.detail.checked)}
                                                    disabled={save || prefillLoading}
                                                    labelPlacement="end"
                                                >
                                                    {condition}
                                                </IonCheckbox>
                                            </IonItem>
                                        </IonCol>
                                    ))}
                                </IonRow>
                            </IonGrid>
                        </IonItemGroup>

                        {/* VACCINATION/IMMUNIZATION */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Vaccination/Immunization
                            </IonItemDivider>

                            <IonRow>
                                <IonCol>
                                    <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000" }}>
                                        <IonCheckbox
                                            checked={form.tentanus_vacc}
                                            onIonChange={(e) => {
                                                handleChange('tentanus_vacc', e.detail.checked);
                                                // Reset tetanus_dose to 0 when unchecked
                                                if (!e.detail.checked) {
                                                    handleChange('tetanus_dose', 0);
                                                }
                                            }}
                                            disabled={save || prefillLoading}
                                            labelPlacement="end"
                                        >
                                            Tetanus Vaccination Received
                                        </IonCheckbox>
                                    </IonItem>
                                </IonCol>
                            </IonRow>

                            <IonRow>
                                <IonCol>
                                    <IonItem lines="none" style={{ "--background": "#fff" }}>
                                        <IonInput
                                            className='ion-margin'
                                            label="Tetanus Dose"
                                            labelPlacement="floating"
                                            fill="outline"
                                            type="number"
                                            value={form.tetanus_dose}
                                            onIonInput={(e) => handleChange('tetanus_dose', parseInt(e.detail.value ?? '0'))}
                                            style={{ "--color": "#000" }}
                                            disabled={save || prefillLoading || !form.tentanus_vacc}
                                        />
                                    </IonItem>
                                </IonCol>
                            </IonRow>
                        </IonItemGroup>

                        {/* VITAL SIGNS */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Vital Signs
                            </IonItemDivider>
                                <IonGrid>
                                    <IonRow>
                                        <IonCol size='12' size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonInput
                                                    className='ion-margin'
                                                    label="Height (cm)"
                                                    labelPlacement="floating"
                                                    fill="outline"
                                                    type="number"
                                                    value={form.height}
                                                    onIonInput={(e) => handleChange('height', parseFloat(e.detail.value ?? '0'))}
                                                    style={{ "--color": "#000" }}
                                                    disabled={save || prefillLoading}
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size='12' size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonInput
                                                    className='ion-margin'
                                                    label="Weight (kg)"
                                                    labelPlacement="floating"
                                                    fill="outline"
                                                    type="number"
                                                    value={form.weight}
                                                    onIonInput={(e) => handleChange('weight', parseFloat(e.detail.value ?? '0'))}
                                                    style={{ "--color": "#000" }}
                                                    disabled={save || prefillLoading}
                                                />
                                            </IonItem>
                                        </IonCol>

                                        <IonCol size='12' size-md='6'>
                                            <IonItem lines="none" style={{ "--background": "#fff" }}>
                                                <IonInput
                                                    className='ion-margin'
                                                    label="Temperature (°C)"
                                                    labelPlacement="floating"
                                                    fill="outline"
                                                    type="number"
                                                    value={form.temperature}
                                                    onIonInput={(e) => handleChange('temperature', parseFloat(e.detail.value ?? '0'))}
                                                    style={{ "--color": "#000" }}
                                                    disabled={save || prefillLoading}
                                                />
                                            </IonItem>
                                        </IonCol>
                                    </IonRow>
                                </IonGrid>
                        </IonItemGroup>

                        {/* SOCIAL SUPPORT NEEDS */}
                        <IonItemGroup>
                            <IonItemDivider
                                style={{
                                    "--color": "#000",
                                    fontWeight: "bold",
                                    "--background": "#fff",
                                }}
                            >
                                Social Support Needs
                            </IonItemDivider>

                            <IonRow>
                                {supportTypes.map((support) => (
                                    <IonCol size="6" key={support}>
                                        <IonItem lines="none" style={{ "--background": "#fff", "--color": "#000" }}>
                                            <IonCheckbox
                                                checked={form.types_of_support.includes(support)}
                                                onIonChange={(e) => handleCheckbox('types_of_support', support, e.detail.checked)}
                                                disabled={save || prefillLoading}
                                                labelPlacement="end"
                                            >
                                                {support}
                                            </IonCheckbox>
                                        </IonItem>
                                    </IonCol>
                                ))}
                            </IonRow>
                        </IonItemGroup>

                        {/* BUTTONS */}
                        <IonRow className="ion-justify-content-center ion-margin-top">
                            <IonCol size="auto">
                                <IonButton 
                                    color="primary" 
                                    onClick={handleSave}
                                    disabled={save || prefillLoading}
                                >
                                    {save ? 'Saving...' : 'Save'}
                                </IonButton>
                            </IonCol>
                            <IonCol size="auto">
                                <IonButton color="medium" fill="outline" onClick={onClose} disabled={save || prefillLoading}>
                                    Cancel
                                </IonButton>
                            </IonCol>
                        </IonRow>
                        
                        {error && (
                            <IonRow>
                                <IonCol>
                                    <div style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                                        {error}
                                    </div>
                                </IonCol>
                            </IonRow>
                        )}
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonModal>
    );
};

export default AddHealthRecord;