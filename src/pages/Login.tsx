import { IonAlert, IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToast, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import React from 'react';
import { logIn, logoFacebook, logoIonic, logoGoogle } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClients';
import Logo from '/assets/logo.png';
import Register from './Register';

const Alertbox: React.FC < {
    message: string;
    isOpen : boolean;
    onClose: () => void }> = ({ message, isOpen, onClose }) => {
        return(
            <IonAlert 
            isOpen={isOpen} 
            onDidDismiss={onClose} 
            header="Notification" 
            message={message} 
            buttons={['OK']} 
            />
        );
    };

const Login: React.FC = () => {
    const router = useIonRouter();
    const [email, setEmail] = React.useState(''); 
    const [password, setPassword] = React.useState('')

    const[present, dismiss] = useIonLoading();
    const [showAlert, setShowAlert] = React.useState(false);
    const [showToast, setShowToast] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');

    //Funtion to handle email and password login
    const doLogin = async () => {
        const {data, error} = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMessage("Login failed " + error.message);
            setShowAlert(true);
            return;
        }

        const user = data.user;

        const pendingProfile = localStorage.getItem('pendingProfile');
        if (pendingProfile) {
            const profile = JSON.parse(pendingProfile);

            const {error: insertError} = await supabase.from('users').insert([
                {
                    username: profile.username,
                    firstName: profile.firstName,
                    lastName: profile.lastName,
                    email: profile.email,
                    auth_id: user.id
                },
            ]);

            if (insertError) {
                setErrorMessage("Failed to create account " + insertError.message);
                setShowAlert(true);
                return;
            } else {
                localStorage.removeItem('pendingProfile');
            }
        }

        router.push('/home', 'forward', 'replace');
    };

    const socialLogin = async (provider: 'google' | 'facebook') => {
        await present('Signing in...');
        try{
            const {error} = await supabase.auth.signInWithOAuth({
                provider,
                options:{
                    redirectTo: `${window.location.origin}/L.E.A.P/auth/callback`,
                    queryParams: {
                        prompt:'select_account',
                    },
                },
            });
            if(error) throw error;
        } catch (error: any){
            setErrorMessage(error.message || 'Login failed');
            setShowAlert(true);
        } finally{
            dismiss();
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
                <IonGrid fixed>
                    <IonRow class="ion-justify-content-center">
                        <IonCol >
                            <IonCard
                                style={{
                                    width: 'clamp(280px, 60vw, 600px)',
                                    padding: 'clamp(12px, 2vw, 32px)',
                                    margin: 'auto',
                                    background: '#fff',
                                    boxShadow: '0 6px 16px rgba(196, 138, 206, 0.25)',
                                    borderRadius: '16px',
                                }}
                            >
                                <IonCardContent>
                                        {/* Logo Image */}
                                    <IonRow class="ion-justify-content-center">
                                        <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                                            <div className="ion-text-center ion-padding">
                                                <img src={Logo} 
                                                     alt="Logo"
                                                     style={{ 
                                                        width: 'clamp(100px, 20vw, 200px)',
                                                        height: 'clamp(100px, 20vw, 150px)', 
                                                        objectFit: 'contain',
                                                        margin: 'auto',
                                                        display: 'block',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        
                                                    }} 
                                                />
                                            </div>
                                        </IonCol>
                                    </IonRow>

                                    <form 
                                        onSubmit={(e) => {
                                             e.preventDefault(); 
                                             doLogin(); 
                                        }}
                                    >

                                        {/* Email Input */}
                                    <IonInput  
                                        value={email}
                                        onIonChange={(e) => setEmail(e.detail.value!)}
                                        fill="outline" 
                                        type ="email" 
                                        label="Email" 
                                        labelPlacement="floating" 
                                        placeholder=" Enter Your Email"
                                        required
                                        style={{
                                            '--highlight-color-focused': '#c48ace',
                                            '--highlight-color': '#8e5a9e',
                                            color: '#444',
                                        }}
                                    >
                                    </IonInput>

                                    {/* Password Input */}
                                    <IonInput 
                                        value={password}
                                        onIonChange={(e) => setPassword(e.detail.value!)}
                                        className='ion-margin-top'
                                        fill="outline" 
                                        type="password" 
                                        label="Password" 
                                        labelPlacement="floating" 
                                        placeholder="Enter Your Password"
                                        required
                                        style={{
                                            '--highlight-color-focused': '#c48ace',
                                            '--highlight-color': '#8e5a9e',
                                            color: '#444',
                                        }}
                                    >
                                        <IonInputPasswordToggle slot="end" color={'medium'}/>
                                    </IonInput>

                                        {/* Login Button */}
                                    <IonButton 
                                        className='ion-margin-top' 
                                        type='submit' 
                                        expand="block" 
                                        shape='round' 
                                        style={{
                                            '--background': 'linear-gradient(90deg, #c48ace, #f8adc6)',
                                            fontWeight: 'bold',
                                            marginTop: '15px',
                                        }}
                                    >
                                        Login
                                        <IonIcon icon={logIn} slot="end" />
                                    </IonButton>
                                    </form>
                                    
                                    {/* Forgot Password Link */}
                                    <div>
                                        <a href="#"
                                           className='ion-float-right'
                                             style={{ 
                                                fontSize: '0.9rem',
                                                marginTop: '10px',
                                            }}
                                        >
                                            Forgot Password
                                        </a>
                                    </div>

                                    <div className="ion-text-center ion-float-center"
                                        style={{
                                            marginTop: '50px ',
                                            fontSize: '0.9rem',
                                            color: '#8e5a9e',
                                        }}
                                    >
                                    or sign in with
                                    </div>

                                        {/* Social Login Buttons */}
                                    <form className='ion-text-center'>
                                            {/*Google Button */}
                                        <IonButton 
                                            className='ion-margin-top'  
                                            fill="clear" 
                                            shape='round' 
                                            size='default'
                                            onClick={() => socialLogin('google')}
                                            style={{
                                                '--color': '#DB4437',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <IonIcon icon={logoGoogle} slot="start" />   
                                        </IonButton>

                                            {/*Facebook Button */}
                                        <IonButton 
                                            className='ion-margin-top'  
                                            fill="clear" 
                                            shape='round' 
                                            size='default'
                                            onClick={() => socialLogin('facebook')}
                                            style={{
                                                '--color': '#4267B2',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            <IonIcon icon={logoFacebook} slot="start" />   
                                        </IonButton>
                                    </form>

                                    <div>
                                        <p className='ion-text-center'
                                            style={{
                                                fontSize: '0.9rem',
                                                marginTop: '10px',
                                            }}
                                        >
                                            Don't have an account? <a  href="/L.E.A.P/Register">Sign up</a>
                                        </p>
                                    </div>
                                </IonCardContent>
                            </IonCard>
                        </IonCol>
                    </IonRow>
                </IonGrid>

                <Alertbox 
                    isOpen = {showToast}
                    message = {errorMessage}
                    onClose = {() => setShowToast(false)}
                />

                <IonToast
                    isOpen = {showAlert}
                    message="Login Successfully !!"
                    onDidDismiss={() => setShowAlert(false)}
                    duration={3000}
                    color='success'
                />

            </IonContent>
        </IonPage>
    );
};

export default Login;