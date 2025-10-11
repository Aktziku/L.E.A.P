import { IonAlert, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonInputPasswordToggle, IonModal, IonPage, IonRow, IonSelect, IonSelectOption, IonText, IonTitle, IonToolbar, useIonRouter } from '@ionic/react';
import React, { use, useState } from 'react';
import { supabase } from '../utils/supabaseClients';
import bcrypt from 'bcryptjs';

const AlertBox: React.FC<{ message: string; isOpen: boolean; onClose: () => void }> = ({ message, isOpen, onClose }) => {
  return (
    <IonAlert
      isOpen={isOpen}
      onDidDismiss={onClose}
      header="Notification"
      message={message}
      buttons={['OK']}
    />
  );
};

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [showVerifycationModal, setShowVerifycationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [Address, setAddress] = useState('');
    const [Gender, setGender] = useState('');
    const router = useIonRouter();
    

    {/*function for account verification*/}
    const handleVerification = () => {
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            setShowAlert(true);
            return;
        }
        setShowVerifycationModal(true);
    }

    {/*function to handle account creation*/}
    const handleSignup = async () => {
         setShowVerifycationModal(false);
         try {
        // Sign up in Supabase authentication first
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    username,
                    firstName: FirstName,
                    lastName: LastName
                }
            }
        });

        if (authError) {
            throw new Error("Account creation failed: " + authError.message);
        }

        if (authData.user) {
            // Store user data in users table with auth_id
            const { error: insertError } = await supabase.from("users").insert([
                {
                    auth_id: authData.user.id,
                    username: username,
                    email: email,
                    firstName: FirstName,
                    lastName: LastName,
                    role: 'user' // Set default role
                }
            ]);

            if (insertError) {
                throw new Error("Failed to save user data: " + insertError.message);
            }

            // Show success modal and redirect
            setShowSuccessModal(true);
            router.push('/login', 'forward', 'replace');
        }
        } catch (err) {
            if (err instanceof Error) {
                setErrorMessage(err.message);
            } else {
                setErrorMessage('Account creation failed');
            }
            setShowAlert(true);
        }
    };

    
    
    return (
        <IonPage>
            <IonContent 
                style={{
                    '--background': '#ffffff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <IonCard
                    style={{
                        width: 'clamp(280px, 60vw, 600px)',
                        padding: 'clamp(12px, 2vw, 32px)',
                        margin: 'auto',
                        background: '#ffffff',
                        boxShadow: '0 6px 16px rgba(196, 138, 206, 0.25)',
                        borderRadius: '16px',
                        marginTop: 'clamp(12px, 2vw, 32px)',                
                    }}
                >
                    <IonCardContent>
                        <h1
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                marginBottom: '1rem',
                                color: '#000000ff',
                                textAlign: 'center'
                            }}
                        >
                            Create an Account

                        </h1>

                        <IonGrid fixed>
                            {/*input fields for lastname and firstname*/}
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        fill="outline" 
                                        label="First Name" 
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your First Name"
                                        required
                                        value={FirstName}
                                        onIonChange={(e) => setFirstName(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem'
                                        }}
                                    />
                                </IonCol>
                                <IonCol>
                                <IonInput
                                        fill="outline" 
                                        label="Last Name" 
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your Last Name"
                                        required
                                        value={LastName}
                                        onIonChange={(e) => setLastName(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem'
                                        }}
                                    />
                                </IonCol>
                            </IonRow>
                       
                            {/*input fields for username*/}
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        fill="outline" 
                                        label="User Name" 
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your UserName"
                                        required
                                        value={username}
                                        onIonChange={(e) => setUsername(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem'
                                        }}
                                    />
                                </IonCol>
                            </IonRow>
                            
                            {/*input fields for email*/}
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        fill="outline" 
                                        label="Email" 
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your Email"
                                        required
                                        value={email}
                                        onIonChange={(e) => setEmail(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem',
                                        }}
                                    />
                                </IonCol>
                            </IonRow>

                            {/*input fields for password*/}
                            <IonRow>
                                <IonCol>
                                    <IonInput
                                        fill="outline" 
                                        label="Password" 
                                        type='password'
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your Password"
                                        required
                                        value={password}
                                        onIonChange={(e) => setPassword(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem',
                                        }}
                                    >
                                        <IonInputPasswordToggle slot="end" />
                                    </IonInput>
                                </IonCol>

                                <IonCol>
                                    <IonInput
                                        fill="outline" 
                                        label="Confirm Password" 
                                        type='password'
                                        labelPlacement="floating" 
                                        placeholder=" Confirm Your Password"
                                        required
                                        value={confirmPassword}
                                        onIonChange={(e) => setConfirmPassword(e.detail.value!)}
                                        style={{
                                            color: '#444',
                                            marginTop: '1rem',
                                        }}
                                    >
                                        <IonInputPasswordToggle slot="end" />
                                    </IonInput>
                                </IonCol>
                            </IonRow>

                            {/*Register button*/}
                            <IonRow>
                                <IonCol>
                                    <IonButton
                                        expand="block"
                                        onClick={handleVerification}
                                        style={{
                                            marginTop: '1rem',
                                        }}
                                    >
                                        Sign Up
                                    </IonButton>
                                </IonCol>
                            </IonRow>
                        </IonGrid>

                        {/*modal for verification */}
                        <IonModal isOpen={showVerifycationModal} onDidDismiss={() => setShowVerifycationModal(false)}>
                            <IonContent style={{'--background': '#ffffff'}}>
                                <IonCard style={{'--background': '#ffffff'}}>
                                    <IonCardHeader>
                                        <IonCardTitle style={{'--color': '#000000ff'}}>Confirm the details</IonCardTitle>
                                        <hr />
                                        <IonCardSubtitle style={{'--color': '#000000ff'}}>Username</IonCardSubtitle>
                                        <IonCardTitle style={{'--color': '#000000ff'}}>{username}</IonCardTitle>

                                        <IonCardSubtitle style={{'--color': '#000000ff'}}>Email</IonCardSubtitle>
                                        <IonCardTitle style={{'--color': '#000000ff'}}>{email}</IonCardTitle>

                                        <IonCardSubtitle style={{'--color': '#000000ff'}}>Name</IonCardSubtitle>
                                        <IonCardTitle style={{'--color': '#000000ff'}}>{FirstName} {LastName}</IonCardTitle>

                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonRow>
                                            <IonCol>
                                                <IonButton
                                                    expand="block"
                                                    onClick={handleSignup}
                                                    style={{
                                                        marginTop: '1rem',
                                                    }}
                                                >
                                                    confirm
                                                </IonButton>
                                            </IonCol>
                                            <IonCol>
                                                <IonButton
                                                    expand="block"
                                                    onClick={() => setShowVerifycationModal(false)}
                                                    style={{
                                                        '--background': '#e93740ff',
                                                        '--background-activated': '#8e5a9e',
                                                        marginTop: '1rem',
                                                    }}
                                                >
                                                    Cancel
                                                </IonButton>
                                            </IonCol>
                                        </IonRow>
                                    </IonCardContent>
                                </IonCard>
                            </IonContent>
                        </IonModal>

                        {/*modal for successful Creating account */}
                        <IonModal isOpen={showSuccessModal} onDidDismiss={() => setShowSuccessModal(false)}>
                            <IonContent>
                                <IonTitle>Account created successfully</IonTitle>
                                <IonText>Redirecting to Login page...</IonText>
                                <IonButton routerLink='/login' routerDirection='back'>Login</IonButton>

                            </IonContent>
                        </IonModal>
                    </IonCardContent>
                </IonCard>
                
                 <AlertBox message={errorMessage} isOpen={showAlert} onClose={() => setShowAlert(false)} />
            </IonContent>
        </IonPage>
    );
};

export default Register;