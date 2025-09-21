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
import React, { useState } from 'react';

interface Profile {
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
}

const AddProfileModal: React.FC<AddProfileModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullname: '',
        age: '',
        birthdate: '',
        gender: '',
        email: '',
        contactnum: '',
        address: '',
        school: '',
        schoollevel: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            ...formData,
            age: parseInt(formData.age)
        });
        // Reset form
        setFormData({
            fullname: '',
            age: '',
            birthdate: '',
            gender: '',
            email: '',
            contactnum: '',
            address: '',
            school: '',
            schoollevel: ''
        });
        onClose();
    };

    const handleInputChange = (field: string, value: string | number | null | undefined) => {
        setFormData(prev => ({
            ...prev,
            [field]: value || ''
        }));
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
                        Add New Profile
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
                <form onSubmit={handleSubmit}>

                    <IonCard
                        style={{
                            borderRadius: '20px',
                            boxShadow: '0 4px 12px rgba(90, 45, 109, 0.3)',
                            background: 'rgba(255, 255, 255, 0.95)',
                        }}  
                    >
                        <IonCardHeader>
                            <IonCardTitle style={{ color: '#5a2d6d' }}>Profile Information</IonCardTitle>
                        </IonCardHeader>

                        <IonCardContent>
                            {/* Form fields */}
                            <IonItem 
                                style={{ 
                                    borderRadius: '12px',
                                     marginBottom: '12px', 
                                    }}
                                >
                                
                                <IonInput
                                    type="text"
                                    label="Full Name"
                                    
                                    value={formData.fullname}
                                    onIonChange={e => handleInputChange('fullname', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Age</IonLabel>
                                <IonInput
                                    type="number"
                                    value={formData.age}
                                    onIonChange={e => handleInputChange('age', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Birthdate</IonLabel>
                                <IonInput
                                    type="date"
                                    value={formData.birthdate}
                                    onIonChange={e => handleInputChange('birthdate', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Gender</IonLabel>
                                <IonSelect
                                    value={formData.gender}
                                    onIonChange={e => handleInputChange('gender', e.detail.value)}
                                    required
                                >
                                    <IonSelectOption value="Male">Male</IonSelectOption>
                                    <IonSelectOption value="Female">Female</IonSelectOption>
                                    <IonSelectOption value="Other">Other</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Email</IonLabel>
                                <IonInput
                                    type="email"
                                    value={formData.email}
                                    onIonChange={e => handleInputChange('email', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Contact Number</IonLabel>
                                <IonInput
                                    type="tel"
                                    value={formData.contactnum}
                                    onIonChange={e => handleInputChange('contactnum', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">Address</IonLabel>
                                <IonInput
                                    type="text"
                                    value={formData.address}
                                    onIonChange={e => handleInputChange('address', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">School</IonLabel>
                                <IonInput
                                    type="text"
                                    value={formData.school}
                                    onIonChange={e => handleInputChange('school', e.detail.value)}
                                    required
                                />
                            </IonItem>

                            <IonItem>
                                <IonLabel position="floating">School Level</IonLabel>
                                <IonSelect
                                    value={formData.schoollevel}
                                    onIonChange={e => handleInputChange('schoollevel', e.detail.value)}
                                    required
                                >
                                    <IonSelectOption value="Elementary">Elementary</IonSelectOption>
                                    <IonSelectOption value="High School">High School</IonSelectOption>
                                    <IonSelectOption value="Senior High">Senior High</IonSelectOption>
                                    <IonSelectOption value="College">College</IonSelectOption>
                                </IonSelect>
                            </IonItem>

                            <IonButton
                                expand="block"
                                type="submit"
                                className="ion-margin-top"
                            >
                                Save Profile
                            </IonButton>
                        </IonCardContent>
                    </IonCard>
                </form>
            </IonContent>
        </IonModal>
    );
};

export default AddProfileModal;