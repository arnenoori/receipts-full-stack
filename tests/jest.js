
// tests for layout.tsx
describe('RootLayout', () => {

    // Renders a ClerkProvider component
    it('should render ClerkProvider with no props', () => {
      const wrapper = shallow(<RootLayout />);
      expect(wrapper.find(ClerkProvider).props()).toEqual({});
    });

    // html element with lang="en" and className="h-full bg-gray-50".
    it('should render html element with lang="en" and className="h-full bg-gray-50"', () => {
      const wrapper = shallow(<RootLayout />);
      expect(wrapper.find('html').props()).toEqual({ lang: 'en', className: 'h-full bg-gray-50' });
    });

    // a body element with className="h-full".
    it('should render body element with className="h-full"', () => {
      const wrapper = shallow(<RootLayout />);
      expect(wrapper.find('body').props()).toEqual({ className: 'h-full' });
    });

    // object returned by getServerSession() is null.
    it('should render Navbar with null user when session is null', async () => {
      jest.spyOn(global, 'getServerSession').mockResolvedValueOnce(null);
      const wrapper = shallow(<RootLayout />);
      await wrapper.instance().componentDidMount();
      expect(wrapper.find(Navbar).props().user).toBe(null);
    });

    // component has a fallback prop.
    it('should render Suspense component with fallback prop', () => {
      const wrapper = shallow(<RootLayout />);
      expect(wrapper.find(Suspense).props().fallback).toBeDefined();
    });
});

// tests for loading.tsx
describe('Loading', () => {

    // main container with a title and a description.
    it('should render a main container with a title and a description', () => {
      const wrapper = shallow(<Loading />);
      expect(wrapper.find('main')).toHaveLength(1);
      expect(wrapper.find(Title)).toHaveLength(1);
      expect(wrapper.find(Text)).toHaveLength(1);
    });

    // disabled search input.
    it('should render a disabled search input', () => {
      const wrapper = shallow(<Loading />);
      expect(wrapper.find(Search).prop('disabled')).toBe(true);
    });

    // div container with a specific class.
    it('should render a div container with a specific class', () => {
      const wrapper = shallow(<Loading />);
      expect(wrapper.find('div.tremor-base')).toHaveLength(1);
    });

    // when the search input is on it should call the handleSearch function on change.
    it('should call the handleSearch function on change when the search input is enabled', () => {
      const handleSearch = jest.fn();
      const wrapper = shallow(<Loading />);
      wrapper.find(Search).prop('onChange')({ target: { value: 'test' } });
      expect(handleSearch).toHaveBeenCalledWith('test');
    });

    // when the search input is off it should not call the handleSearch function on change.
    it('should not call the handleSearch function on change when the search input is disabled', () => {
      const handleSearch = jest.fn();
      const wrapper = shallow(<Loading />);
      wrapper.find(Search).prop('onChange')({ target: { value: 'test' } });
      expect(handleSearch).not.toHaveBeenCalled();
    });

});
