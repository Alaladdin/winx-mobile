import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, ActivityIndicator, Card } from 'react-native-paper';
import { map } from 'lodash';
import { api } from '../services/api';

interface IScheduleItem {
  auditorium: string
  beginLesson: string,
  building: string,
  date: string,
  dayOfWeekString: string,
  discipline: string,
  disciplineAbbr: string,
  endLesson: string,
  group: null | string,
  kindOfWork: string,
  lecturer: string,
}

export function ScheduleScreen() {
  const [schedule, setSchedule] = useState(null);
  const [isLoading, setLoading] = useState(false);

  if (schedule === null && !isLoading) {
    setLoading(true);

    api.get('/getSchedule')
      .then((data) => {
        setSchedule(data.schedule);
      })
      .catch(() => {
        // todo error
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <ScrollView>
      {
        isLoading
          ? <ActivityIndicator animating />
          : (
            map(schedule, (scheduleItem, index) => (
              <Card key={ index }>
                <Card.Content>
                  <Card.Title
                    title={ scheduleItem.disciplineAbbr }
                    subtitle={ scheduleItem.kindOfWork }
                    right={ () => <Text>{ scheduleItem.date }</Text> }
                    left={ () => <Text>{ scheduleItem.dayOfWeekString.toUpperCase() }</Text> }
                  />
                </Card.Content>
              </Card>
            ))
          )
      }
    </ScrollView>
  );
}
