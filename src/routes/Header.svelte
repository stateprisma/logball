<script lang="ts">
	import {
		Collapse,
		Nav,
		Navbar,
		NavbarBrand,
		NavbarToggler,
		NavItem,
		NavLink
	} from '@sveltestrap/sveltestrap';

	let isOpen = false;

	async function toggle() {
		isOpen = isOpen ? false : true;
	}
</script>

<Navbar color="dark" theme="dark">
	<NavbarBrand href="/" class="me-auto">LogBall</NavbarBrand>	
	<NavbarToggler on:click={toggle} class="me-2" />
	<Collapse {isOpen} navbar>
		<Nav navbar>
			<NavItem>
				<NavLink
					href="https://github.com/stateprisma/logball"
					target="_blank"
					rel="noopener noreferrer"
				>
					github
				</NavLink>
			</NavItem>
		</Nav>
	</Collapse>
</Navbar>
