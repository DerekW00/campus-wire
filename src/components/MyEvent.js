import { useState, useEffect } from 'react'; // Make sure to import useState and useEffect
import {
  Card,
  CardHeader,
  Badge,
  Flex,
  Box,
  Heading,
  Text,
  Image,
} from '@chakra-ui/react';
import { auth, database } from '../services/firebase';
import { ref, get, child } from 'firebase/database';

function formatDateAndTime(dateTimeString) {
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);
  
    const timeOptions = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = new Date(dateTimeString).toLocaleTimeString('en-US', timeOptions);
  
    return `${formattedDate} @ ${formattedTime}`;
  }

function MyEvents() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

    useEffect(() => {
      if (user) { // Check if user is not null
        const dbRef = ref(database);
        get(child(dbRef, 'user-events/' + user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              const snap = snapshot.val();
              console.log(snap);
  
              // Convert the object to an array
              const dataArray = Object.values(snap);
              dataArray.sort((a, b) => new Date(a.Time) - new Date(b.Time));
  
              console.log('dataArray', dataArray);
  
              setData(dataArray);
            } else {
              console.log('No data available');
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }, [user]);


    useEffect(() => {
      const currentTime = new Date();
      const threshold = 10 * 60 * 1000; // 10 minutes in milliseconds
  
      data.forEach((event) => {
        const eventTime = new Date(event.Time);
        const timeDifference = eventTime - currentTime;
  
        if (timeDifference > 0 && timeDifference <= threshold) {
          const notification = new Notification(`Reminder: ${event.Title}`, {
            body: `Your event ${event.Title} is about to start at ${formatDateAndTime(event.Time)}!`,
          });
        }
      });
    }, [data]);
  
    const [permission, setPermission] = useState(Notification.permission);
  
    useEffect(() => {
      if (permission === 'default') {
        Notification.requestPermission().then((newPermission) => {
          setPermission(newPermission);
        });
      }
    }, [permission]);

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


    return (
      <Box>
      <div class="top-bar" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "70px" }}>
        <h3>My Events</h3>
      </div>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: '340px' }}>
      <Box maxH="83vh" overflowY="scroll">
        {Object.keys(groupedEvents).map((monthYear) => (
          <div key={monthYear}>
            <Heading as="h2" size="lg" textAlign="center">
              {monthYear}
            </Heading>
            {groupedEvents[monthYear].map((item) => (
              <div key={item.Title}>
                <Card maxW="md" variant="outline">
                  <CardHeader>
                    <Flex spacing="4">
                      <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                        <Image
                          objectFit="cover"
                          src="thumbnail.png"
                          alt="Chakra UI"
                        />
                        <Box>
                            <Badge colorScheme={getColorByType(item.Type)} >{item.Type}</Badge>
                            <div style={{ height: '10px' }}></div>
                            <Heading size='md'>{item.Title}</Heading>
                            <Text>📍 {item.Location}
                                    <br />
                                    📅 {formatDateAndTime(item.Time)}
                            </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  </CardHeader>
                  <Text>{item.description}</Text>
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

export default MyEvents;