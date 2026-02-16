package com.recrutplus.recrutplus.dto.address;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AddressDTO {
    private Long id;
    private String street;
    private String number;
    private String postalCode;
    private String city;
    private String country;
}