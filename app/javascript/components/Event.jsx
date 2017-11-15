import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatDuration } from '../utils/dateFormat'

class Event extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showEditMode: false
    }

    this.toggleEditEvent = this.toggleEditEvent.bind(this)
  }

  toggleEditEvent() {
    this.setState({
      showEditMode: !this.state.showEditMode
    })
  }

  render() {
    const {
      name,
      duration_minutes,
      location
    } = this.props.event

    const { event, users } = this.props

    const toggleEditEvent = () => this.toggleEditEvent()
    const durMins = duration_minutes % 60
    const durHours = Math.floor((duration_minutes - durMins) % 600 / 60)

    return (
      <div className='card-container'>
        <div className='card-body'>
          { this.state.showEditMode
            ?
            <div>
              <h1 className="event-title edit-event-title-container">
                <input
                  className="edit-event-title event-title"
                  defaultValue={ name }>
                </input>
                <div className="edit-event-buttons">
                  <button className="btn btn--confirm">Save</button>
                  <button
                    className="btn btn--cancel"
                    onClick={ this.toggleEditEvent }>
                    Cancel
                  </button>
                </div>
              </h1>
              <div className='card-fields'>
                <div className='event-field edit-event-duration-container'>
                  <i className='fa fa-2x fa-clock-o'></i>
                  <input type="number"
                    className="edit-duration-hours"
                    name="hours"
                    defaultValue={ durHours }>
                  </input> hrs
                  <input type="number"
                    className="edit-duration-mins"
                    name="minutes"
                    defaultValue={ durMins }>
                  </input> min
                </div>
                <div className='event-field'>
                  <i className='fa fa-2x fa-map-marker'></i>
                  <input
                    className="edit-event-location"
                    defaultValue={ location }>
                  </input>
                </div>
                <div className="opacity-medium cursor-default">
                  <div className='event-field event-final-time'>
                    Scheduled Time: { event.time || 'TBD' }
                  </div>
                  <button
                    className='btn btn--disabled'
                    disabled>
                    Fill In Your Availability
                  </button>
                  <h2 className='event-attendees margin-auto'>Attendees:</h2>
                  <ul className='user-list margin-auto'>
                  { users.map( (user, i) =>
                    <li className='avatar' key={i}>
                      <img src='/images/user.png' alt='user pic' /> {user.name}
                    </li>
                  )}
                  </ul>
                </div>
              </div>
            </div>
            :
            <div>
              <h1 className='event-title'>
                <span className="event-title-text">{ name }</span>
                <i onClick={ toggleEditEvent }
                  className='fa fa-pencil edit-event'>
                </i>
              </h1>
              <div className='card-fields'>
                <div className='event-field event-duration'>
                  <i className='fa fa-2x fa-clock-o'></i>
                  { formatDuration(duration_minutes) }
                </div>

                <div className='event-field'>
                  <i className='fa fa-2x fa-map-marker'></i> { location }
                </div>
                <div className='event-field event-final-time'>
                  Scheduled Time: { event.time || 'TBD' }
                </div>
                <a href={`/events/${event.slug}?availability=edit`}>
                  <button className='fill-in-availability-button btn'>
                    Fill In Your Availability
                  </button>
                </a>
                <h2 className='event-attendees no-margin'>Attendees:</h2>
                <ul className='user-list no-margin'>
                { users.map( (user, i) =>
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
