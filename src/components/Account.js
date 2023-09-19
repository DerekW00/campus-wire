import { useState, useEffect } from "react";
import { auth } from "../services/firebase";
import { Flex } from '@chakra-ui/react';



function Account() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return <div></div>;
    }

    return (
        <div>
            <div class="top-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
                <h3>Account</h3>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <img src="profile.png" alt="profile pic" style={{ width: "150px", height: "150px", borderRadius: "50%" }}/>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50px" }}>
                <h4>Hugh</h4>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "30px" }}>
                <p>Mungus</p>
            </div>
            <div style={{ height: '40px'}}></div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <a href="/Profile" style={{ flex: '1 0 50%', maxWidth: '50%', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <img src='icons/profile.png' alt='profile' style={{ marginBottom: '10px' }} />
                    <h5 style={{ color: 'black' }}> Profile </h5>
                    </div>
                </a>
                <a href='/MyEvents' style={{ flex: '1 0 50%', maxWidth: '50%', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <img src='icons/events.png' alt='my events' style={{ marginBottom: '10px' }} />
                    <h5 style={{ color: 'black' }}> My Events </h5>
                    </div>
                </a>
                <a href='/Calendar' style={{ flex: '1 0 50%', maxWidth: '50%', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <img src='icons/calendar.png' alt='calendar' style={{ marginBottom: '10px' }} />
                    <h5 style={{ color: 'black' }}> Calendar </h5>
                    </div>
                </a>
                <a href='/MyFavorites' style={{ flex: '1 0 50%', maxWidth: '50%', textDecoration: 'none' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                    <img src='icons/favorites.png' alt='favorites' style={{ marginBottom: '10px' }} />
                    <h5 style={{ color: 'black' }}> Favorites </h5>
                    </div>
                </a>
            </div>


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

export default Account;