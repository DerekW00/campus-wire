import { Button, Stack, Center } from '@chakra-ui/react'


function Landing() {
    return (
        <div>
            <div style={ {height: '350px'} }></div>
            <Center>
                <img src="logo.png" width="300" alt="logo" />
            </Center>
            <div style={ {height: '150px'} }></div>
            <Center>
                <Stack direction='column' spacing={1} centerContent>
                    <a href='/SignUp'>
                        <img src='signup.png' alt='Sign up'/>
                    </a>
                    <img src='login.png' alt='login'/>
                </Stack>
            </Center>
        </div>
            
            
    );
}

export default Landing;