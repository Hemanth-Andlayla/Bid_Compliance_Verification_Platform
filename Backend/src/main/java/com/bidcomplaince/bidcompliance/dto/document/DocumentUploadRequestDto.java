package com.bidcomplaince.bidcompliance.dto.document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class DocumentUploadRequestDto {

    @NotBlank(message = "Document type is required")
    private String documentType;

    @NotNull(message = "Document file is required")
    private MultipartFile file;
}