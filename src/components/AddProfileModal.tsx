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
    IonCardTitle
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClients';

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

interface AddProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (profile: Omit<Profile, 'profileid'>) => void;
    profileToEdit?: Profile | null;
    isEditing?: boolean;
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave, profileToEdit, isEditing }) => {
    const [originalForm, setOrignalForm] = useState<Omit<Profile, 'profileid'>>({
        fullname: '',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        address: '',
        school: '',
        schoollevel: ''
    });
    const [formData, setFormData] = useState<Omit<Profile, 'profileid'>>({
        fullname: '',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        address: '',
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
                fullname: '',
                age: 0,
                birthdate: '',
                gender: '',
                email: '',
                contactnum: '',
                address: '',
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

    const handleClear = () => {
        setFormData({
        fullname: '',
        age: 0,
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        address: '',
        school: '',
        schoollevel: ''
        });
    };

    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>

                <IonToolbar
                    style={{
                        '--background': 'linear-gradient(90deg, #c48ace, #f8adc6)',
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
                            '--color': '#c48ace',
                            borderRadius: '8px',
                            marginRight: '10px',
                            fontWeight: 'bold',
                        }}
                    >
                        Close
                     </IonButton>

                </IonToolbar>
            </IonHeader>

            <IonContent
                style={{
                    '--background': 'linear-gradient(135deg, #c48ace, #f8adc6)',
                    padding: '20px',
                }}
            >

                    <IonCard
                        style={{
                            borderRadius: '16px',
                            padding: '20px',
                            background: '#fff',
                            boxShadow: '0 4px 12px rgba(196, 138, 206, 0.25)',
                        }}
                        >

                        <IonCardContent>
                            {/* Basic Information */}
                            <h2 style={{ 
                                fontSize: '1rem', 
                                fontWeight: 'bold', 
                                margin: '20px 0 10px',
                                color: '#8e5a9e',
                                }}
                            >
                            Basic Information
                            </h2>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '12px' 
                                }}
                            >
                                {/* Full Name */}
                            <IonItem
                                lines='none'
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    marginBottom: '12px',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonInput
                                    label="Full Name"
                                    labelPlacement="floating"
                                    type="text"
                                    value={formData.fullname}
                                    onIonChange={e => handleInputChange('fullname', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>

                                {/* Gender */}
                            <IonItem 
                                lines='none'
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    marginBottom: '12px',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonSelect
                                    label="Gender"
                                    labelPlacement="floating"
                                    value={formData.gender}
                                    onIonChange={e => handleInputChange('gender', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                >
                                    <IonSelectOption value="Male">Male</IonSelectOption>
                                    <IonSelectOption value="Female">Female</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                                {/* Age */}
                            <IonItem 
                                lines='none'
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    marginBottom: '12px',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >                   
                                <IonInput
                                    label="Age"
                                    labelPlacement="floating"
                                    type="number"
                                    value={formData.age}
                                    onIonChange={e => handleInputChange('age', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>

                                {/* Birthdate */}
                            <IonItem 
                                lines='none'
                                style={{
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    marginBottom: '12px',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonInput
                                    label="Birthdate"
                                    labelPlacement="floating"
                                    type="date"
                                    value={formData.birthdate}
                                    onIonChange={e => handleInputChange('birthdate', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>
                            </div>

                            {/* Contact Information */}
                            <h2 style={{ 
                                fontSize: '1rem', 
                                fontWeight: 'bold', 
                                margin: '20px 0 10px',
                                color: '#8e5a9e',
                                }}
                            >
                            Contact Information
                            </h2>
                            
                            {/* Address */}
                            <IonItem  
                                lines='none'
                                style={{ 
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                            <IonInput
                                    label="Address"
                                    labelPlacement="floating"
                                    type="text"
                                    value={formData.address}
                                    onIonChange={e => handleInputChange('address', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                            />
                            </IonItem>

                            {/* Contact Number and email div */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '12px' 
                                }}
                            >
                                {/* Contact Number */}
                            <IonItem 
                                lines='none'
                                style={{ 
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonInput
                                    label="Contact Number"
                                    labelPlacement="floating"
                                    type="tel"
                                    value={formData.contactnum}
                                    onIonChange={e => handleInputChange('contactnum', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>

                                {/* Email */}
                            <IonItem 
                                lines='none'
                                style={{ 
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonInput
                                    label="Email (optional)"
                                    labelPlacement="floating"
                                    type="email"
                                    value={formData.email}
                                    onIonChange={e => handleInputChange('email', e.detail.value)}
                                    style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>
                            </div>

                            {/* Educational Background */}
                            <h2 style={{ 
                                fontSize: '1rem', 
                                fontWeight: 'bold', 
                                margin: '20px 0 10px',
                                color: '#8e5a9e',
                                }}
                            >
                            Educational Background
                            </h2>

                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr', 
                                gap: '12px' 
                                }}
                            >
                                {/* School Level */}
                            <IonItem
                                lines='none'
                                style={{ 
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonSelect
                                    label="School Level"
                                    labelPlacement="floating"
                                    value={formData.schoollevel}
                                    onIonChange={e => handleInputChange('schoollevel', e.detail.value)}
                                     style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                >
                                <IonSelectOption value="Elementary">Elementary</IonSelectOption>
                                <IonSelectOption value="Junior High">High School</IonSelectOption>
                                <IonSelectOption value="Senior High">Senior High</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                                {/* School Name */}
                            <IonItem 
                                lines='none'
                                style={{ 
                                    marginBottom: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e6d6eb',
                                    padding: '4px 8px',
                                    boxShadow: '0 2px 6px rgba(196, 138, 206, 0.1)',
                                    '--highlight-color-focused': '#c48ace', 
                                    '--highlight-color-valid': '#8e5a9e',   
                                    '--highlight-color-invalid': '#f8adc6',
                                    '--background': '#fff',
                                }}
                            >
                                <IonInput
                                    label="School Name"
                                    labelPlacement="floating"
                                    type="text"
                                    value={formData.school}
                                    onIonChange={e => handleInputChange('school', e.detail.value)}
                                     style={{
                                        '--padding-start': '8px',
                                        '--padding-end': '8px',
                                        fontSize: '0.95rem',
                                        '--highlight-color-focused': '#c48ace',
                                        '--highlight-color': '#8e5a9e',
                                        color: '#353434ff', 
                                        '--background': '#fff',
                                        'border': 'none',
                                    }}  
                                />
                            </IonItem>
                            </div>

                            {/* Buttons */}
                            <div style={{ 
                                display: 'flex', 
                                justifyContent: 'center', 
                                gap: '12px', marginTop: 
                                '24px' 
                                }}
                            >

                                {/* Save Button */}
                            <IonButton
                                type="submit"
                                onClick={handleSave}
                                style={{
                                '--background': 'linear-gradient(90deg, #c48ace, #f8adc6)',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                
                                }}
                            >
                                Save
                            </IonButton>

                                {/*Reset and Clear Button */}
                            {isEditing ?(
                                <IonButton
                                    fill="outline"
                                    onClick={handleReset}
                                    disabled={JSON.stringify(formData) === JSON.stringify(originalForm)}
                                    style={{
                                    '--color': '#c48ace',
                                    '--border-color': '#c48ace',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    opacity: JSON.stringify(formData) === JSON.stringify(originalForm) ? '0.6' : '1',
                                    pointerEvents: JSON.stringify(formData) === JSON.stringify(originalForm) ? 'none' : 'auto',
                                    }}
                                >
                                    Reset
                                </IonButton>

                            ) : (
                                <IonButton
                                    fill="outline"
                                    onClick={handleClear}
                                    style={{
                                    '--color': '#c48ace',
                                    '--border-color': '#c48ace',
                                    borderRadius: '8px',
                                    fontWeight: 'bold',
                                    }}
                                >
                                    Clear
                                </IonButton>

                            )}

                             
                            </div>
                        </IonCardContent>
                    </IonCard>

            </IonContent>
        </IonModal>
    );
};

export default AddProfileModal;