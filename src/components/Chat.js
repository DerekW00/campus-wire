import { useState, useEffect } from 'react'; // Make sure to import useState and useEffect
import { Card, CardHeader, Flex, Box, Heading,
         Text, Badge } from '@chakra-ui/react';
import { Image } from '@chakra-ui/image';
import { auth, database } from '../services/firebase';
import { ref, get, child } from 'firebase/database';


function formatDateAndTime(dateTimeString) {
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);

  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedTime = new Date(dateTimeString).toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} @ ${formattedTime}`;
}

function Chat() {
    const [user, setUser] = useState(null);
    const [data, setData] = useState([]);

    const getColorByType = (eventType) => {
        switch (eventType) {
          case 'Networking':
            return 'blue';
          case 'Alumni':
            return 'green';
          case 'Company Visit':
            return 'purple';
          default:
            return 'gray';
        }
      };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (!user) {
        return;
        }

        const dbRef = ref(database);
        get(child(dbRef, `user-favorites/${user.uid}`))
        .then((snapshot) => {
            if (snapshot.exists()) {
            const snap = snapshot.val();
            const dataArray = Object.values(snap);
            setData(dataArray);
            } else {
            console.log('No data available');
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }, [user]);

    const groupEventsByMonth = () => {
        const groupedEvents = {};
    
        data.forEach((item) => {
          const eventDate = new Date(item.Time);
          const monthYear = eventDate.toLocaleString('default', { month: 'long', year: 'numeric' });
    
          if (!groupedEvents[monthYear]) {
            groupedEvents[monthYear] = [];
          }
    
          groupedEvents[monthYear].push(item);
        });
    
        return groupedEvents;
      };
    
    const groupedEvents = groupEventsByMonth();

  return (
      <Box>
      <div style={{ padding: "20px", display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <img style={{ width: "70%" }}src='campuswave.png' alt='campuswave'/>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: '340px' }}>
      <Box maxH="83vh" overflowY="scroll">
        {Object.keys(groupedEvents).map((monthYear) => (
          <div key={monthYear}>
            {groupedEvents[monthYear].map((item) => (
              <div key={item.Title}>
                <Card maxW="md" variant="outline">
                  <CardHeader>
                    <Flex spacing="4">
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Box flex="1"> {/* Make the Box take up available space */}
                            <Badge colorScheme={getColorByType(item.Type)}> {item.Type}</Badge>
                            <div style={{ height: '10px' }}></div>
                            <a href='/WoOchat'> 
                            <Heading size="sm">{item.Title}</Heading>
                            </a>
                            <Text color={'black'}>
                            📍 {item.Location}
                            <br />
                            📅 {formatDateAndTime(item.Time)}
                            </Text>
                        </Box>
                        <Image
                            objectFit="cover"
                            src="thumbnail.png"
                            alt="Chakra UI"
                            style={{ flexShrink: 0, width: '100px', height: '130px', borderRadius:'15px'  }} 
                        />
                    </Flex>
                    </Flex>
                  </CardHeader>
                </Card>
                <div style={{ height: '20px' }}></div>
              </div>
            ))}
          </div>
        ))}
      </Box>
        </div>
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
      </Box>
  );
}

export default Chat;