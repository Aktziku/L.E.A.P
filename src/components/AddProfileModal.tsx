import {
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButton,
    IonCard,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonCardHeader,
    IonCardTitle,
    useIonActionSheet,
    IonRow,
    IonCol,
    IonGrid,
    IonItemGroup,
    IonItemDivider
} from '@ionic/react';
import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '../utils/supabaseClients';

interface Profile {
    profileid: number;
    firstname: string;
    lastname: string;
    age: number;
    birthdate: string;
    gender: string;
    email: string;
    contactnum: string;
    barangay: string,
    minicipality: string,
    province: string,
    school: string;
    schoollevel: string;
}

interface AddProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: Omit<Profile, 'profileid'>) => void;
    profileToEdit?: Profile | null;
    isEditing?: boolean;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave, profileToEdit, isEditing }) => {
    const [originalForm, setOrignalForm] = useState<Omit<Profile, 'profileid'>>({
        firstname: '',
        lastname:'',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        barangay: '',
        minicipality: '',
        province: '',
        school: '',
        schoollevel: ''
    });
    const [formData, setFormData] = useState<Omit<Profile, 'profileid'>>({
        firstname: '',
        lastname:'',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        barangay: '',
        minicipality: '',
        province: '',
        school: '',
        schoollevel: ''
    });

    useEffect(() => {
        if(isEditing && profileToEdit) {
            const {profileid, ...rest} = profileToEdit;
            setFormData(rest);
            setOrignalForm(rest);
        } else {
            const emptyForm ={
                firstname: '',
                lastname:'',
                age: 0,
                birthdate: '',
                barangay: '',
                minicipality: '',
                province: '',
                gender: '',
                email: '',
                contactnum: '',
                school: '',
                schoollevel: ''
            };
            setFormData(emptyForm);
            setOrignalForm(emptyForm);
        }
    }, [isEditing, profileToEdit, isOpen]);

    const handleInputChange =(key: keyof Omit<Profile, 'profileid'>, value : any) => {
        setFormData((prev)=>({...prev, [key]: value }));
    };

    // save handler
    const handleSave = async () => {
        try{
            if (isEditing && profileToEdit) {
                const {error} = await supabase
                    .from('profile')
                    .update(formData)
                    .eq("profileid", profileToEdit.profileid)

                    if (error) throw error;
            } else {
                const {error} = await supabase.from('profile').insert([formData]);
                if (error) throw error;
            }
            onSave(formData);
            onClose();
        } catch (error) {
            console.error("Erro Saving Profile",error);
        }
    };

    const handleReset = () => {
        setFormData(originalForm);
    };
  const handleChange = (key: keyof typeof formData, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const handleSubmit = () => {
    console.log("Form Submitted:", formData);
  };
    const handleClear = () => {
        setFormData({
        firstname: '',
        lastname:'',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        barangay: '',
        minicipality: '',
        province: '',
        school: '',
        schoollevel: ''
        });
    };



    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose} style={{'--width':'1400px','--height':'700px'}} >
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
                        {isEditing ? 'Edit Profile' : 'Add Profile'}
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

               <IonContent>
                    <IonGrid>
                    {/* Personal Information */}
                    <IonItemGroup>
                        <IonItemDivider style={{ fontSize: "large", marginTop: "10px" }}>
                        Personal Information
                        </IonItemDivider>

                        <IonRow>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="First Name"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.firstname}
                                onIonChange={(e) => handleChange("firstname", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Last Name"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.lastname}
                                onIonChange={(e) => handleChange("lastname", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        </IonRow>

                        <IonRow>
                        <IonCol>
                            <IonItem lines="none" >
                            <IonInput
                                className="ion-margin-top"
                                label="Age"
                                type="number"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.age}
                                onIonChange={(e) => handleChange("age", Number(e.detail.value))}
                            />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Birthdate"
                                type="date"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.birthdate}
                                onIonChange={(e) => handleChange("birthdate", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        </IonRow>
                    </IonItemGroup>

                    {/* Address Information */}
                    <IonItemGroup>
                        <IonItemDivider style={{ fontSize: "large", marginTop: "10px" }}>
                        Address Information
                        </IonItemDivider>

                        <IonRow>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Barangay"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.barangay}
                                onIonChange={(e) => handleChange("barangay", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Municipality"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.minicipality}
                                onIonChange={(e) => handleChange("minicipality", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        </IonRow>

                        <IonRow>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Province"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.province}
                                onIonChange={(e) => handleChange("province", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="Contact Number"
                                labelPlacement="floating"
                                fill="outline"
                                type="tel"
                                value={formData.contactnum}
                                onIonChange={(e) => handleChange("contactnum", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        </IonRow>
                    </IonItemGroup>

                    {/* Educational Background (your example) */}
                    <IonItemGroup>
                        <IonItemDivider style={{ fontSize: "large", marginTop: "10px" }}>
                        Educational Background
                        </IonItemDivider>

                        <IonRow>
                        <IonCol>
                            <IonItem lines="none">
                            <IonInput
                                className="ion-margin-top"
                                label="School Name"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.school}
                                onIonChange={(e) => handleChange("school", e.detail.value!)}
                            />
                            </IonItem>
                        </IonCol>
                        <IonCol>
                            <IonItem lines="none">
                            <IonSelect
                                className="ion-margin-top"
                                label="Educational Attainment"
                                labelPlacement="floating"
                                fill="outline"
                                value={formData.schoollevel}
                                onIonChange={(e) => handleChange("schoollevel", e.detail.value!)}
                            >
                                <IonSelectOption value="Elementary">Elementary</IonSelectOption>
                                <IonSelectOption value="Junior High">Junior High</IonSelectOption>
                                <IonSelectOption value="Senior High">Senior High</IonSelectOption>
                                <IonSelectOption value="College">College</IonSelectOption>
                            </IonSelect>
                            </IonItem>
                        </IonCol>
                        </IonRow>
                    </IonItemGroup>
                     {/* Submit Button */}
                    <IonRow>
                        <IonCol>
                        <IonButton expand="block" onClick={handleSubmit}>
                            Submit
                        </IonButton>
                        </IonCol>
                    </IonRow>
                </IonGrid>

      </IonContent>
        </IonModal>
    );
};

export default AddProfileModal;