import { IonAlert, IonButton, IonCard, IonCardContent, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonInput, IonInputPasswordToggle, IonPage, IonRow, IonTitle, IonToast, IonToolbar, useIonLoading, useIonRouter } from '@ionic/react';
import React from 'react';
import { logIn, logoFacebook, logoIonic, logoGoogle } from 'ionicons/icons';
import { supabase } from '../utils/supabaseClients';

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
       
        try{ 
            await present('Logging in...'); 
            const {error} = await 
            supabase.auth.signInWithPassword({email, password}); 

            if(error){ 
                setErrorMessage(error.message); 
                setShowAlert(true); 
                return; 
            } 

            setShowToast(true);
            setTimeout(() => {
                 router.push('/home', 'root', 'replace');
                 }, 
                 800); 
                } catch 
                (error: any){
                     setErrorMessage(error.message || 'Login failed');
                      setShowAlert(true);
                    } finally{
                         dismiss();
                } 
        };

    const socialLogin = async (provider: 'google' | 'facebook') => {
        await present('Signing in...');
        try{
            const {error} = await supabase.auth.signInWithOAuth({
                provider,
                options:{
                    redirectTo: `${window.location.origin}/L.E.A.P/auth/callback`,
                }
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
        <IonPage className='ion-justify-content-center'>
            <IonContent>
                <IonGrid fixed>
                    <IonRow class="ion-justify-content-center">
                        <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                            <IonCard>
                                <IonCardContent>

                                    <IonRow class="ion-justify-content-center">
                                        <IonCol size="12" size-md="8" size-lg="6" size-xl="4">
                                            <div className="ion-text-center ion-padding">
                                                <IonIcon icon={logoIonic} style={{ width: '100px', height: '100px' }} />
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
                                    >
                                        <IonInputPasswordToggle slot="end" color={'dark'}></IonInputPasswordToggle>
                                    </IonInput>

                                    <IonButton 
                                        className='ion-margin-top' 
                                        type='submit' 
                                        expand="block" 
                                        shape='round' 
                                        color='primary'
                                    >
                                        Login
                                        <IonIcon icon={logIn} slot="end" />
                                    </IonButton>

                                    </form>

                                    <div className="ion-text-center">
                                    or sign in with
                                    </div>

                                    <form className='ion-text-center'>
                                            {/*Google Button */}
                                        <IonButton 
                                            className='ion-margin-top'  
                                            fill="clear" 
                                            shape='round' 
                                            size='small'
                                            onClick={() => socialLogin('google')}
                                        >
                                            <IonIcon icon={logoGoogle} slot="start" />   
                                        </IonButton>

                                            {/*Facebook Button */}
                                        <IonButton 
                                            className='ion-margin-top'  
                                            fill="clear" 
                                            shape='round' 
                                            size='small'
                                            onClick={() => socialLogin('facebook')}
                                        >
                                            <IonIcon icon={logoFacebook} slot="start" />   
                                        </IonButton>
                                    </form>
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