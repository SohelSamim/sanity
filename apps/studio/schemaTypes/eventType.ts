import { CalendarIcon } from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import { DoorsOpenInput } from './components/DoorsOpenInput'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'details', title: 'Details'},
    {name: 'editorial', title: 'Editorial'},
  ],

  fields: [
    defineField({
      name: 'name',
      type: 'string',
      group: 'details',
    }),
    
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'details',
      options: {source: 'name'},
      validation: (rule) => rule.required().error(`Required to generate a page on the website`),
      hidden: ({document}) => !document?.name,
      readOnly: ({value, currentUser}) => {
        // Anyone can set the initial slug
        if (!value) {
          return false
        }

        const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator')

        // Only admins can change the slug
        return !isAdmin
      },
    }),
    defineField({
      name: 'eventType',
      type: 'string',
      group: 'details',
      options: {
        list: ['in-perosn','virtual'],
        layout: 'radio'
      }
    }),    
    defineField({
      name: 'date',
      type: 'datetime',
      group: 'editorial',
    }),
    defineField({
      name: 'doorsOpen',
      description: 'number iof minutes before the start time for admission',
      type: 'number',
      initialValue: 50,
      group: 'details',
      components: {
        input: DoorsOpenInput
      }
    }),
    defineField({
      name: 'venue',
      type: 'reference',
      to: [{type: 'venue'}],
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      to: [{type: 'artist'}],
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'details',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'tickets',
      type: 'url',
    }),
  ],

  // Update the preview key in the schema
preview: {
  select: {
    name: 'name',
    venue: 'venue.name',
    artist: 'headline.name',
    date: 'date',
    image: 'image',
  },
  prepare({name, venue, artist, date, image}) {
    const nameFormatted = name || 'Untitled event'
    const dateFormatted = date
      ? new Date(date).toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })
      : ''

    return {
      title: artist ? `${nameFormatted} (${artist})` : nameFormatted,
      subtitle: venue ? `${dateFormatted} @ ${venue}` : dateFormatted,
      media: image || CalendarIcon,
    }
  },
},
})

