import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatDuration } from '../utils/dateFormat'

class Event extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: this.props.event.name,
      duration_minutes: this.props.event.duration_minutes,
      location: this.props.event.location,
      event: this.props.event,
      users: this.props.users,
      // TODO: Parse this server-side
      locations: JSON.parse(this.props.locations),
      showEditMode: false,
      editedName: this.props.event.name,
      editedDurationMinutes: 0,
      editedLocation: this.props.event.location.name,
      // editedLocationID: this.props.event.location.id,
      errors: {
        nameInvalid: false,
        nameInvalidMsg: '',
        durationInvalid: false,
        durationInvalidMsg: '',
        locationInvalid: false,
        locationInvalidMsg: ''
      }
    }

    this.toggleEditEvent = this.toggleEditEvent.bind(this)
    this.validateEdits = this.validateEdits.bind(this)
    this.saveEditedEvent = this.saveEditedEvent.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleDurationChange = this.handleDurationChange.bind(this)
  }

  toggleEditEvent() {
    this.setState({
      showEditMode: !this.state.showEditMode
    })
  }

  saveEditedEvent() {
    console.log('Saving event...')
  }

  validateEdits() {
    console.log('Validating...', this.state.name)
    const errors = this.state.errors

    if (this.state.editedName === '') {
      errors.nameInvalid = 'Event name is required'
    } else {
      errors.nameInvalid = false
    }
    if (this.state.editedDurationMinutes <= 0) {
      errors.durationInvalid = 'Event duration time must be greater than 0 minutes'
    } else {
      errors.durationInvalid = false
    }
    if (this.state.editedLocation === '') {
      errors.locationInvalid = 'Event location is required'
    } else {
      errors.locationInvalid = false
    }

    if (errors.nameInvalid || errors.durationInvalid || errors.locationInvalid) {
      console.log('Error, not submitting to saveEditedEvent()')
      return
    } else {
      this.saveEditedEvent()
    }
  }

  handleChange(e) {
    console.log(`changing this.state.${e.target.name} to "${e.target.value}".`)
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleDurationChange(e) {
    const hoursInMinutes = parseInt(this.refs.hours.value, 10) * 60
    const minutes = parseInt(this.refs.minutes.value, 10)
    this.setState({
      editedDurationMinutes: hoursInMinutes + minutes
    })
    setTimeout(() => {
      console.log(`editedDurationMinutes = ${this.state.editedDurationMinutes}`)
    }, 500)
  }

  render() {
    const durMins = this.state.duration_minutes % 60
    const durHours = Math.floor((this.state.duration_minutes - durMins) % 600 / 60)

    return (
      <div className='card-container'>
        <div className='card-body'>
          { this.state.showEditMode
            ?
            <div>
              <h1 className="event-title edit-event-title-container">
                {/* TODO: Make editedName field have same functionality
                  as other fields when toggleEditMode is executed twice */}
                <input
                  className="edit-event-title event-title"
                  name="editedName"
                  defaultValue={ this.state.editedName }
                  onChange={ this.handleChange }>
                </input>
                <div className="edit-event-buttons">
                  <button
                    className="btn btn--confirm"
                    onClick={ this.validateEdits }>
                    Save
                  </button>
                  <button
                    className="btn btn--cancel"
                    onClick={ this.toggleEditEvent }>
                    Cancel
                  </button>
                </div>
                { this.state.errors.nameInvalid &&
                  <div className="error-msg">
                    { this.state.errors.nameInvalid }
                  </div>
                }
              </h1>
              <div className='card-fields'>
                <div className='event-field edit-event-duration-container'>
                  <i className='fa fa-2x fa-clock-o'></i>
                  <input type="number"
                    className="edit-duration-hours"
                    name="hours"
                    ref="hours"
                    min="0"
                    defaultValue={ durHours }
                    onChange={ this.handleDurationChange }>
                  </input> hrs
                  <input type="number"
                    className="edit-duration-mins"
                    name="minutes"
                    ref="minutes"
                    min="0"
                    defaultValue={ durMins }
                    onChange={ this.handleDurationChange }>
                  </input> min
                  { this.state.errors.nameInvalid &&
                    <div className="error-msg">
                      { this.state.errors.nameInvalid }
                    </div>
                  }
                </div>
                <div>
                  <i className='fa fa-2x fa-map-marker'></i>
                  <label htmlFor='locationId'>
                    Select a Location
                  </label>
                  <select
                    name='locationId'
                    value={ this.state.editedLocation }
                    onChange={ this.handleChange }
                  >
                    {this.state.locations.map((location) =>
                      <option value={ location.id } key={ location.id }>
                        {location.name}
                      </option>
                    )}
                    <option value='0'>
                      -- Add a New Location --
                    </option>
                  </select>
                  {/* { this.state.locationId == '0' && this.state.errors.locationInvalid &&
                    <div className='error-msg'>
                      { this.state.errors.locationInvalid }
                    </div>
                  } */}
                </div>
            </div>
            <div className={`new-location ${ this.state.locationId !== '0' && 'hidden'}`}>
              <div>
                <label htmlFor='locationName'>
                  Name of New Location:
                </label>
                <input
                  type='text'
                  name='locationName'
                  value={ this.state.locationName }
                  onChange={ this.handleChange }
                />
              </div>
              <div>
                <label htmlFor='locationAddress'>
                  Address of New Location:
                </label>
                <input
                  type='text'
                  name='locationAddress'
                  value={ this.state.locationAddress }
                  onChange={ this.handleChange }
                />
              </div>
            </div>
              <div className="opacity-medium cursor-default">
                <div className='event-field event-final-time'>
                  Scheduled Time: { this.state.event.time || 'TBD' }
                </div>
                <button
                  className='btn btn--disabled'
                  disabled>
                  Fill In Your Availability
                </button>
                <h2 className='event-attendees margin-auto'>Attendees:</h2>
                <ul className='user-list margin-auto'>
                { this.state.users.map( (user, i) =>
                  <li className='avatar' key={i}>
                    <img src='/images/user.png' alt='user pic' /> {user.name}
                  </li>
                )}
                </ul>
              </div>
            </div>
            :
            <div>
              <h1 className='event-title event-title_show-page'>
                { this.state.name }
                <i onClick={ this.toggleEditEvent } className='fa fa-pencil edit-event'></i>
              </h1>
              <div className='card-fields'>
                <div className='event-field event-duration'>
                  <i className='fa fa-2x fa-clock-o'></i>
                  { formatDuration(this.state.duration_minutes) }
                </div>

                <div className='event-field'>
                  <i className='fa fa-2x fa-map-marker'></i> { this.state.location }
                </div>
                <div className='event-field event-final-time'>
                  Scheduled Time: { this.state.event.time || 'TBD' }
                </div>
                <a href={`/events/${this.state.event.slug}?availability=edit`}>
                  <button className='fill-in-availability-button btn'>
                    Fill In Your Availability
                  </button>
                </a>
                <h2 className='event-attendees no-margin'>Attendees:</h2>
                <ul className='user-list no-margin'>
                { this.state.users.map( (user, i) =>
                  <li className='avatar' key={i}>
                    <img src='/images/user.png' alt='user pic' /> {user.name}
                  </li>
                )}
                </ul>
              </div>
            </div>
            }
        </div>
      </div>
    )
  }
}

Event.propTypes = {
  authToken: PropTypes.string,
  event: PropTypes.object.isRequired,
  timeslots: PropTypes.array,
  users: PropTypes.array.isRequired
}

export default Event