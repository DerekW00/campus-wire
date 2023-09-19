import { Flex } from '@chakra-ui/react';

function WoOchat() {
    return (
        <div>
            <div style={{ padding: "20px", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <img style={{ width: "70%" }}src='campuswave.png' alt='campuswave'/>
            </div>
            <img src="wozchat.png" alt="chat" />
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
            <Flex justify="space-between" align="center" padding="10px">
                <a href='/CreateEvent'><img src='add.png' alt='create new event'/></a>
                <a href='/Chat' ><img src='chat.png' alt='chat'/></a>
                <a href='/Home'><img src='home.png' alt='home'/></a>
                <a href='/Account'><img src='person.png' alt='person'/></a>
                <a href='/Search'><img src='search.png' alt='search'/></a>
            </Flex>
            </div>
        </div>
    );
}

export default WoOchat;