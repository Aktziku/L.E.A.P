import { IonButton, IonCard, IonCardContent, IonCol, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonSpinner, IonText, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClients';

interface EducationRecordProps {
    isOpen: boolean;
    onClose:() => void;
    onSave: (record:any) => Promise<void>;
}

interface ProfileOption {
    profileid: number;
    firstName: string | null;
    lastName: string | null;
}

interface formState {
    profileid: number | null;
    typeOfProgram: string;
    programCourse: string;
    status: string;
    institutionOrCenter: string;
    enrollmentDate: string;
    elementary: string;
    juniorHigh: string;
    seniorHigh: string;
    college: string;
}

const emptyForm: formState = {
    profileid: null,
    typeOfProgram: '',
    programCourse: '',
    status: '',
    institutionOrCenter: '',
    enrollmentDate: '',
    elementary: '',
    juniorHigh: '',
    seniorHigh: '',
    college: '',
};

const AddEnrollRecordModal: React.FC<EducationRecordProps> = ({ isOpen, onClose, onSave, }) => {
    const [profiles, setProfiles] = useState<ProfileOption[]>([]);
    const [loading, setLoading] = useState(false);
    const [save,setSave] = useState(false);
    const [prefillLoading, setPrefillLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<formState>(emptyForm);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() =>{
        if (!isOpen) {
            return;
        }
        setForm(emptyForm);
        setError(null);
        void loadProfiles();
    }, [isOpen]);

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
        }
    };

    const handleProfileSelect = async (rawValue: any) => {
        const selectedProfileId = rawValue ? Number(rawValue) : null;
        setError(null);

        setForm((prevForm) => ({
            ...prevForm,
            profileid: selectedProfileId,
            ...(selectedProfileId ? {} : {
                elementary: '',
                juniorHigh: '',
                seniorHigh: '',
                college: '',
            }),
        }));

        if (!selectedProfileId) {
            return;
        }

        setPrefillLoading(true);
        const {data, error} = await supabase
            .from('EducationAndTraining')
            .select('elementary, juniorHigh, seniorHigh, college')
            .eq('profileid', selectedProfileId)
            .maybeSingle();

            if (error) {
                setError(error.message);
            } else if (data) {
                setForm((prevForm) => ({
                    ...prevForm,
                    elementary: data.elementary ?? '',
                    juniorHigh: data.juniorHigh ?? '',
                    seniorHigh: data.seniorHigh ?? '',
                    college: data.college ?? '',
                }));
            } else {
                setForm((prevForm) => ({
                    ...prevForm,
                    elementary: '',
                    juniorHigh: '',
                    seniorHigh: '',
                    college: '',
                }));
            }
            setPrefillLoading(false);
            
    };

    const handleChange = <K extends keyof formState>(key: K, value: formState[K]) => {
        setForm((prevForm) => ({
            ...prevForm,
            [key]: value,
        }));
    };

    const handleSave = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (!form.profileid) {
            setError('Please select a profile');
            return;
        }
        setSave(true);
        setError(null);
    

        const payload = {
            profileid: form.profileid,
            typeOfProgram: form.typeOfProgram || null,
            programCourse: form.programCourse || null,
            status: form.status || null,
            institutionOrCenter: form.institutionOrCenter || null,
            enrollmentDate: form.enrollmentDate || null,
            elementary: form.elementary || null,
            juniorHigh: form.juniorHigh || null,
            seniorHigh: form.seniorHigh || null,
            college: form.college || null,
        };

        const {error} = await supabase
            .from('EducationAndTraining')
            .insert(payload);

        if (error) {
            setError(error.message);
        } else {
            await onSave(payload);
            setForm(emptyForm);
        }
        setSave(false);
    };

    const showEmptyProfilesMessage = useMemo(
        () => !loading && profiles.length === 0,
        [loading, profiles.length],
    );

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}  style={{'--width':'100%','--height':'100%',}}>
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
                                  <IonList style={{ "--background": "#fff", margin : 'auto'}}>

                                        {error && (
                                        <IonText color="danger" style={{ display: "block", marginBottom: "1rem" }}>
                                            {error}
                                        </IonText>
                                        )}

                                        {/* Profile Selector */}
                                        <IonItem style={{ "--background": "#fff", "--color": "#000000", '--background-hover':'#fff', '--background-focused':'transparent','--background-activated':'#fff',  }}>
                                        <IonLabel position="stacked" style={{ '--color': '#000000' }}>
                                            Name <IonText color="danger">*</IonText>
                                        </IonLabel>
                                        <IonSelect
                                            placeholder="Select profile"
                                            value={form.profileid ?? undefined}
                                            onIonChange={(event) =>
                                           handleProfileSelect( event.detail.value)
                                            }
                                            interface="popover"
                                            disabled={save || showEmptyProfilesMessage || prefillLoading}
                                            style={{ '--color': '#000000' }}
                                        >
                                            {profiles.map((profile) => (
                                            <IonSelectOption key={profile.profileid} value={profile.profileid}>
                                                {(profile.lastName ?? 'Unknown')}, {profile.firstName ?? 'Unknown'} (ID: {profile.profileid})
                                            </IonSelectOption>
                                            ))}
                                        </IonSelect>
                                         {prefillLoading && (
                                            <IonSpinner slot="end" name="dots" style={{ transform: 'translateY(6px)' }} />
                                        )}
                                        </IonItem>

                                        {/* Type of Program */}
                                        <IonItem style={{ "--background": "#fff" }}>
                                        <IonLabel position="stacked" style={{ '--color': '#000000' }}>
                                            Type of Program <IonText color="danger">*</IonText>
                                        </IonLabel>
                                        <IonInput
                                            value={form.typeOfProgram}
                                            onIonChange={(event) => handleChange('typeOfProgram', event.detail.value ?? '')}
                                            placeholder="e.g. Vocational Training"
                                            style={{ '--color': '#000000' }}
                                        />
                                        </IonItem>

                                        {/* Other Fields */}
                                        {[
                                        { label: "Program or Course", key: "programCourse", type: "text" as const },
                                        { label: "Status", key: "status", type: "text" as const },
                                        { label: "Institution / Training Center", key: "institutionOrCenter", type: "text" as const },
                                        { label: "Date Enrolled", key: "enrollmentDate", type: "date" as const },
                                        { label: "Elementary", key: "elementary", type: "text" as const },
                                        { label: "Junior High", key: "juniorHigh", type: "text" as const },
                                        { label: "Senior High", key: "seniorHigh", type: "text" as const },
                                        { label: "College", key: "college", type: "text" as const },
                                        ].map((item) => (
                                        <IonItem key={item.key} style={{ "--background": "#fff", "--color": "#000000" }}>
                                            <IonLabel position="stacked" style={{ '--color': '#000000' }}>{item.label}</IonLabel>
                                            <IonInput
                                            type={item.type ?? "text"}
                                            value={(form as any)[item.key]}
                                            onIonChange={(event) => handleChange(item.key as keyof formState, event.detail.value ?? '')}
                                            style={{ '--color': '#000000' }}
                                            />
                                        </IonItem>
                                        ))}

                                    </IonList>

                                    {showEmptyProfilesMessage && (
                                        <IonText color="medium" style={{ display: 'block', marginTop: '1rem' }}>
                                        No profiles found. Create a profile first.
                                        </IonText>
                                    )}

                                    <IonRow className="ion-justify-content-center ion-margin-top">
                                        <IonCol size="auto">
                                        <IonButton
                                            expand="block"
                                            onClick={handleSave}
                                            style={{ '--background': '#002d54', color: '#fff' }}
                                            disabled={save || loading || showEmptyProfilesMessage || prefillLoading}
                                        >
                                            {save ? <IonSpinner name="lines-small" /> : 'Save'}
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

export default AddEnrollRecordModal;