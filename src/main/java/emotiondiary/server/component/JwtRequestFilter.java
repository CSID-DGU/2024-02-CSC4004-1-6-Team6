package emotiondiary.server.component;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtRequestFilter extends OncePerRequestFilter {

    private final ApplicationContext appContext;
    private final JwtTokenService jwtTokenService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authorizationHeader = request.getHeader("Authorization");

        String jwt = null;
        String userType = null;

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            userType = jwtTokenService.extractUserType(jwt);
        }

        if (jwt != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetailsService userDetailsService = getUserDetailsService(userType);
            // 사용자 이메일을 추출
            String email = jwtTokenService.extractUserEmail(jwt);

            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtTokenService.validateToken(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        chain.doFilter(request, response);
    }

    private UserDetailsService getUserDetailsService(String userType) {
        if ("MANAGER".equals(userType)) {
            return appContext.getBean("managerDetailsService", UserDetailsService.class);
        } else {
            return appContext.getBean("userDetailsServiceImpl", UserDetailsService.class);
        }
    }
}