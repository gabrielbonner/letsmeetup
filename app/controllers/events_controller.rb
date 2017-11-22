class EventsController < ApplicationController
  JSONResource = ActiveModelSerializers::SerializableResource

  before_action :create_new_location, only: :create
  skip_before_action :auth, only: :landing

  def landing
    @auth_token ||= form_authenticity_token if current_user
  end

  def index
    events = Event.includes(:location, timeslots: :preferences)
    events_json = JSONResource.new(events)
    render react_component: 'Events',
           props: {
             events: events_json,
             authToken: form_authenticity_token
           }
  end

  def show
    event = Event.includes(:users, timeslots: [{ preferences: :user }])
                 .find_by_slug(params[:id])
    event_json = JSONResource.new(event, serializer: EventShowSerializer)
    timeslots_json = JSONResource.new(event.timeslots_with_ranking)
    users_json = JSONResource.new(event.users)
    # is there a more Rails-y way to do this?
    locations = Location.order("name ASC").to_a.map do |location|
      { id: location['id'], name: location['name'] }
    end

    props = {
      event: event_json,
      timeslots: timeslots_json,
      users: users_json,
      authToken: form_authenticity_token,
      locations: locations.to_json
    }

    respond_to do |format|
      if params[:availability]
        format.html do
          render react_component: 'EventAvailability', props: props
        end
      else
        format.html { render react_component: 'Event', props: props }
      end
      format.json { render json: props }
    end
  end

  def new
    @locations = Location.all.sort_by(&:name)
    render react_component: 'EventNew',
           props: {
             locations: @locations,
             authToken: form_authenticity_token
           }
  end

  def create_new_location
    return unless event_params[:locationId] == '0'

    # location_id == '0', so new Location needs to be created
    @location = Location.create(
      name: event_params[:locationName],
      address: event_params[:locationAddress]
    )
  end

  def edit
    # find event that it being edited
    # IF locationId == 0
      # create and save new location
    # ELSE
      # set location to params[:locationId]
    # edit event
    # IF it saves
      # render the event show page
    # ELSE
      # send the appropriate error message
  end

  def create
    event_location = @location ? @location.id : event_params[:locationId]

    @event = Event.create(
      name: event_params[:name],
      duration_minutes: event_params[:durationMinutes],
      location_id: event_location
    )

    timeslots = event_params[:timeslots].split(',')
    timeslots.each do |timeslot|
      Timeslot.create(
        start_time: timeslot,
        event_id: @event.id
      )
    end

    return redirect_to "/events/#{@event.slug}" if @event
    # TODO: handle error
    redirect_to '/events/new'
  end

  private

  def event_params
    params.permit(
      :name,
      :durationMinutes,
      :locationId,
      :locationName,
      :locationAddress,
      :authenticity_token,
      :timeslots,
      :availability
    )
  end
end
