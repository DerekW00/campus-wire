import { useState, useEffect } from 'react'; // Make sure to import useState and useEffect
import { Card, CardHeader, Button, Flex, Box, Heading,
         Text, Image, useToast, Modal, ModalOverlay, ModalContent,
         ModalHeader, ModalCloseButton, ModalBody,
         useDisclosure, Badge } from '@chakra-ui/react';
import { auth, database } from '../services/firebase';
import { ref, get, child, push } from 'firebase/database';


function formatDateAndTime(dateTimeString) {
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = new Date(dateTimeString).toLocaleDateString('en-US', options);

  const timeOptions = { hour: 'numeric', minute: 'numeric' };
  const formattedTime = new Date(dateTimeString).toLocaleTimeString('en-US', timeOptions);

  return `${formattedDate} @ ${formattedTime}`;
}

function Home() {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [addedToFavorites, setAddedToFavorites] = useState({});

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
        setUser(user);
    });

    return () => unsubscribe();
}, []);

  useEffect(() => {
    const dbRef = ref(database);
    get(child(dbRef, 'events/'))
      .then((snapshot) => {
        if (snapshot.exists()) {
          const snap = snapshot.val();
          console.log(snap);

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
  }, []);

  const addToFavorites = (eventData) => {
    if (!user) {
      console.log("You need to sign in first.");
      return;
    }
  
    // Push the event data to the user's favorites path
    push(child(ref(database), `user-favorites/${user.uid}`), eventData)
      .then(() => {
        const addedEventTitle = eventData.Title;
  
        toast({
          title: 'Event added to Favorites.',
          description: "You'll receive a reminder 10 minutes before the event.",
          status: 'info',
          duration: 9000,
          isClosable: true,
          position: 'top',
        });
  
        setAddedToFavorites((prevFavorites) => ({
          ...prevFavorites,
          [addedEventTitle]: true,
        }));
  
        const currentTime = new Date();
        const threshold = 60 * 60 * 1000; // 10 minutes in milliseconds
        const eventTime = new Date(eventData.Time);
        const timeDifference = eventTime - currentTime;
  
        if (timeDifference > 0 && timeDifference <= threshold) {
          new Notification(`Reminder: ${addedEventTitle}`, {
            body: `Your event ${addedEventTitle} is about to start at ${formatDateAndTime(eventData.Time)}!`,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding event to favorites:", error);
      });
  };
  

  // useEffect(() => {
  //   const currentTime = new Date();
  //   const threshold = 10 * 60 * 1000; // 10 minutes in milliseconds

  //   data.forEach((event) => {
  //     const eventTime = new Date(event.Time);
  //     const timeDifference = eventTime - currentTime;

  //     if (timeDifference > 0 && timeDifference <= threshold) {
  //       const notification = new Notification(`Reminder: ${event.Title}`, {
  //         body: `Your event ${event.Title} is about to start at ${formatDateAndTime(event.Time)}!`,
  //       });
  //     }
  //   });
  // }, [data]);

  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    if (permission === 'default') {
      Notification.requestPermission().then((newPermission) => {
        setPermission(newPermission);
      });
    }
  }, [permission]);

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
      {Object.entries(groupedEvents).map(([monthYear, events]) => (
        <div key={monthYear}>
          <Heading size="lg" textAlign="center" marginTop="10px">
            {monthYear}
          </Heading>
          {events.map((item) => (
            <div key={item.Title}>
              <Card maxW="md" variant={'outline'}>
              <CardHeader>
                <Flex spacing='4'>
                  <Flex flex='1'
                    gap='4'
                    alignItems='center'
                    flexWrap='wrap'
                    onClick={() => {
                      setSelectedEvent(item);
                      onOpen(); // Open the modal
                    }}
                    style={{ cursor: 'pointer' }}>
                    {/* <Avatar name={item.Title} src={item.image} /> */}
                    <Image
                      objectFit='cover'
                      src='thumbnail.png'
                      // src={item.image}
                      alt='Chakra UI'
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
              
              </Card>
              <div style={{ height: '20px' }}></div>
            </div>
          ))}
        </div>
      ))}
        </Box>
        <Modal size='xs' onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{selectedEvent ? selectedEvent.Title : ''}</ModalHeader>
            <ModalCloseButton />
            {selectedEvent && (
              <ModalBody>
                <Image
                  objectFit='cover'
                  src='thumbnail.png'
                  // src={selectedEvent.image}
                  alt='Chakra UI'
                />
                <div style={{ height: '10px' }}></div>
                <Box>
                  <Badge colorScheme={getColorByType(selectedEvent.Type)} >{selectedEvent.Type}</Badge>
                  <div style={{ height: '10px' }}></div>
                  <Heading size='sm'>{selectedEvent.Title}</Heading>
                  <Text>📍 {selectedEvent.Location}<br />
                        📅 {formatDateAndTime(selectedEvent.Time)}</Text>
                </Box>
                <Text>{selectedEvent.Description}</Text>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    onClick={() => addToFavorites(selectedEvent)}
                    colorScheme={getColorByType(selectedEvent.Type)}
                    disabled={addedToFavorites[selectedEvent.Title]} // Disable button if already added
                  >
                    {addedToFavorites[selectedEvent.Title] ? 'Added to Favorites' : 'Add to Favorites'}
                  </Button>
                </div>
                <div style={{ height: '10px' }}></div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Button
                    onClick={() =>
                      toast({
                        title: 'Event added to Google Calendar.',
                        status: 'info',
                        duration: 9000,
                        isClosable: true,
                        position: 'top',
                      })}>
                    Add to Google Calendar
                  </Button>
                </div>
              </ModalBody>
            )}
            <div style={{ height: '18px' }}></div>
            {/* <ModalFooter></ModalFooter> */}
          </ModalContent>
        </Modal>
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

export default Home;
