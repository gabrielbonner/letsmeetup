import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatDuration } from '../utils/dateFormat'

class Event extends Component {
  constructor(props) {
    super(props)

    const durMins = this.props.event.duration_minutes % 60
    const durHours = Math.floor((this.props.event.duration_minutes - durMins) % 600 / 60)

    this.state = {
      name: this.props.event.name,
      duration_minutes: this.props.event.duration_minutes,
      location: this.props.event.location,
      event: this.props.event,
      users: this.props.users,
      // TODO: Serialize this server-side
      locations: JSON.parse(this.props.locations),
      showEditMode: false,
      durMins: durMins,
      durHours: durHours,
      editedDurationMinutes: durMins + durHours,
      editedName: this.props.event.name,
      editedLocation: this.props.event.location,
      newLocationName: '',
      newLocationAddress: '',
      errors: {
        nameInvalid: false,
        durationInvalid: false,
        locationInvalid: false,
        newLocationNameInvalid: false,
        newLocationAddressInvalid: false
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
    if (this.state.editedDurationMinutes === 0) {
      errors.durationInvalid = 'Event duration time must be greater than 0 minutes'
    } else {
      errors.durationInvalid = false
    }
    if (this.state.editedLocation === '') {
      errors.editedLocation = 'Event location is required'
    } else {
      errors.locationInvalid = false
    }
    if (this.state.editedLocation === '0' && this.state.newLocationName === '') {
      errors.newLocationNameInvalid = 'New location name required'
    } else {
      errors.newLocationNameInvalid = false
    }
    if (this.state.editedLocation === '0' && this.state.newLocationAddress === '') {
      errors.newLocationAddressInvalid = 'New location address required'
    } else {
      errors.newLocationAddressInvalid = false
    }

    if (Object.keys(errors).some( key => errors[key])) {
      this.setState({ errors })
      console.log('Invalid field, not saving event...')
      return
    } else {
      this.setState({ errors })
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
                    defaultValue={ this.state.durHours }
                    onChange={ this.handleDurationChange }>
                  </input> hrs
                  <input type="number"
                    className="edit-duration-mins"
                    name="minutes"
                    ref="minutes"
                    min="0"
                    defaultValue={ this.state.durMins }
                    onChange={ this.handleDurationChange }>
                  </input> min
                  { this.state.errors.durationInvalid &&
                    <div className="error-msg">
                      { this.state.errors.durationInvalid }
                    </div>
                  }
                </div>
                <div>
                  <i className='fa fa-2x fa-map-marker'></i>
                  <label htmlFor='locationId'>
                    Select a Location
                  </label>
                  <select
                    name='editedLocation'
                    value={ this.state.editedLocation }
                    onChange={ this.handleChange }
                  >
                    {this.state.locations.map((location) =>
                      <option value={ location.name } key={ location.name }>
                        {location.name}
                      </option>
                    )}
                    <option value='0'>
                      -- Add a New Location --
                    </option>
                  </select>
                  { this.state.errors.locationInvalid &&
                    <div className='error-msg'>
                      { this.state.errors.locationInvalid }
                    </div>
                  }
                </div>
              </div>
              <div className={`new-location
                ${ this.state.editedLocation === '0' && 'new-location-div' }
                ${ this.state.editedLocation !== '0' && 'hidden' } `}>
                <div className='card-fields'>
                  <label htmlFor='locationName'>
                    Name of New Location:
                  </label>
                  <input
                    type='text'
                    name='newLocationName'
                    value={ this.state.locationName }
                    onChange={ this.handleChange }
                  />
                </div>
                { this.state.errors.newLocationNameInvalid &&
                  <div className='error-msg'>
                    { this.state.errors.newLocationNameInvalid }
                  </div>
                }
                <div className='card-fields'>
                  <label htmlFor='locationAddress'>
                    Address of New Location:
                  </label>
                  <input
                    type='text'
                    name='newLocationAddress'
                    value={ this.state.locationAddress }
                    onChange={ this.handleChange }
                  />
                </div>
                { this.state.errors.newLocationAddressInvalid &&
                  <div className='error-msg'>
                    { this.state.errors.newLocationAddressInvalid }
                  </div>
                }
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
